# Skill: publish-higgsboson-packages

## Description
Publish Higgsboson packages to npm. Only `@higgsboson/core` and theme packages (`@higgsboson/theme-captain-america`, `@higgsboson/theme-caramel`) are published. `@higgsboson/utils` is internal-only and **never published**.

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | `>=24.0.0` (see `.nvmrc`) |
| npm | `>=12.0.0` (required for `npm stage publish/promote`) |
| NPM_TOKEN | Full publish token (`Read + Publish`, not stage-only) |

### Get a publish token

1. Go to https://www.npmjs.com/settings/TOKENS
2. Create a new **Automation** token with **Read + Publish** access
3. Enable **2FA** on your npm account
4. Set `NPM_TOKEN` in your environment

### Upgrade npm (if needed)

Node 24 LTS ships with npm 11.x. `npm stage publish/promote` requires npm 12+:

```bash
npm install -g npm@12
npm --version  # should print 12.x.x
```

## Publish Scripts

All scripts are available at the root:

| Script | What it does |
|--------|--------------|
| `npm run release:patch` | Bump patch version (bug fixes) |
| `npm run release:minor` | Bump minor version (new features) |
| `npm run release:major` | Bump major version (breaking changes) |
| `npm run publish:stage:all` | Stage all packages |
| `npm run publish:stage:core` | Stage core package |
| `npm run publish:stage:captain-america` | Stage captain-america theme |
| `npm run publish:stage:caramel` | Stage caramel theme |
| `npm run publish:promote:all` | Promote all staged packages |
| `npm run publish:promote:core` | Promote core to latest |
| `npm run publish:promote:captain-america` | Promote captain-america to latest |
| `npm run publish:promote:caramel` | Promote caramel to latest |

Workspace-level scripts (run inside each package dir):
- `publish:stage` → `npm stage publish --access public`
- `publish:promote` → `npm stage promote @higgsboson/<name>@<version> --from=stage --to=latest`

## Publish Workflows

### Option A: Direct publish (full publish token)

Use when your npm token has **Read + Publish** access (not stage-only).

```bash
# 1. Verify
npm run test:utils
npm run pre-push

# 2. Build
npm run build

# 3. Cut release
npm run release:patch   # or :minor / :major

# 4. Push with tags
git push origin main --follow-tags

# 5. Publish (core first, then themes)
npm run publish:core
npm run publish:captain-america
npm run publish:caramel
```

### Option B: Staged publish (stage-only token)

Use when your npm token is **stage-only**. Requires npm 12+.

```bash
# 1. Upgrade npm (one-time)
npm install -g npm@12

# 2. Verify, build, cut release, push (same as Option A steps 1-4)
npm run test:utils
npm run pre-push
npm run build
npm run release:patch
git push origin main --follow-tags

# 3. Stage all packages
npm run publish:stage:all

# 4. Promote all staged packages (maintainer with 2FA)
npm run publish:promote:all

# Or promote individually:
npm run publish:promote:core
npm run publish:promote:captain-america
npm run publish:promote:caramel
```

## Publish Order (Important)

Always publish **core first**, then themes. Themes declare `@higgsboson/core` as a `peerDependency`, so core must be available first.

```
1. @higgsboson/core          (publish first)
2. @higgsboson/theme-captain-america
3. @higgsboson/theme-caramel
```

**`@higgsboson/utils` is internal-only — never published.**

## Consumer Usage

```bash
# Core only
npm install @higgsboson/core

# Core + theme (both required for themed styling)
npm install @higgsboson/core @higgsboson/theme-captain-america
npm install @higgsboson/core @higgsboson/theme-caramel
```

## Pre-Release Checklist

- [ ] All tests pass: `npm run test:utils` (105/105)
- [ ] Lint passes: `npm run pre-push`
- [ ] All packages build: `npm run build`
- [ ] `.nvmrc` matches Node version used (currently `v24.22.1`)
- [ ] `CHANGELOG.md` is generated and reviewed
- [ ] `NPM_TOKEN` is set (full publish token, not stage-only)
- [ ] npm version is 12+ for staged publishing: `npm --version`
- [ ] Git tag is pushed with `--follow-tags`
- [ ] Core published before themes

## Commit Convention (for standard-version)

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Bump | Example |
|------|------|---------|
| `fix:` | Patch | `fix: resolve step divider rendering` |
| `feat:` | Minor | `feat: add tooltip component` |
| `feat!:`, `fix!:` | Major | `feat!: change core API` |
| `BREAKING CHANGE:` in body | Major | — |

Other types (`chore:`, `docs:`, `refactor:`, `style:`, `test:`, `build:`, `ci:`, `perf:`) don't trigger a version bump.

## Files Involved

| File | Purpose |
|------|---------|
| `package.json` (root) | Release scripts, engine requirements, standard-version devDep |
| `packages/core/package.json` | Core publish config, peerDep target for themes |
| `packages/themes/captain-america/package.json` | Theme publish config, peerDep on core |
| `packages/themes/caramel/package.json` | Theme publish config, peerDep on core |
| `packages/utils/package.json` | Internal only, not published |
| `.npmrc` | Registry URL, `NPM_TOKEN` auth |
| `.versionrc.json` | standard-version configuration |
| `RELEASE.md` | Full release process documentation |
| `AGENTS.md` | AI agent guide with release quick reference |
| `.skills/upgrade-node-version.md` | Node + npm upgrade instructions |

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `Stage-only tokens cannot publish...` | Token is stage-only | Get a full `Read + Publish` token, or use staged publish + 2FA promotion |
| `npm stage publish: command not found` | npm < 12 | `npm install -g npm@12` |
| `EBADENGINE` | Node/npm version mismatch | Install Node >=24 and npm >=12 |
| `prepublishOnly` or `prepublish` fails | Build script issue | Run `npm run build` first |
