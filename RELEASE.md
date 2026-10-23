# Release Process — Higgsboson

This document describes how to cut a new release of the Higgsboson monorepo and publish packages to npm.

## Package Structure (split for consumers)

Consumers import packages separately. Each workspace is published as its own scoped package on npm:

| Package | npm name | What it contains |
|---------|----------|------------------|
| `packages/core` | `@higgsboson/core` | Core CSS classes (default theme) — required by all themes |
| `packages/themes/captain-america` | `@higgsboson/theme-captain-america` | Captain America theme (peerDepends on `@higgsboson/core`) |
| `packages/themes/caramel` | `@higgsboson/theme-caramel` | Caramel theme (peerDepends on `@higgsboson/core`) |
| `packages/utils` | `@higgsboson/utils` | Internal renderer + utils (**not published**) |

**Consumers install what they need:**
```bash
# Core only
npm install @higgsboson/core

# Core + a theme
npm install @higgsboson/core @higgsboson/theme-captain-america
```

Each theme declares `@higgsboson/core` as a `peerDependency`, so consumers must install core themselves.

---

## Release Workflow

We use [standard-version](https://github.com/conventional-changelog/standard-version) for automated semantic versioning and changelog generation, driven by [Conventional Commits](https://www.conventionalcommits.org/).

### 1. Prepare on a release branch (optional but recommended)

```bash
git checkout -b release/v1.0.0
```

### 2. Verify everything is green

```bash
# Install dependencies with correct Node (see .nvmrc)
nvm use
npm install

# Run tests
npm run test:utils

# Run lint (pre-push hook equivalent)
npm run pre-push

# Build all packages (dist/ must exist before publish)
npm run build
```

### 3. Cut the release

Standard-version will:
- Bump versions based on commit types (`feat:` → minor, `fix:` → patch, `BREAKING CHANGE:` → major)
- Generate `CHANGELOG.md` from conventional commits
- Create a git tag (e.g., `v1.0.0`)
- Commit the changelog and version bumps

```bash
# Patch release (bug fixes)
npm run release:patch

# Minor release (new features)
npm run release:minor

# Major release (breaking changes)
npm run release:major
```

### 4. Push tags and commits

```bash
git push origin main --follow-tags
```

The `pre-push` hook runs lint on all workspaces before allowing the push.

### 5. Publish to npm

Publish each workspace individually. Themes must be published after core (they peerDepend on it).

**Token requirements:** Your `NPM_TOKEN` must be a **full publish token** (not stage-only). If your token is stage-only, you'll get an error like:

> Stage-only tokens cannot publish new package versions directly. Versions must be staged with `npm stage publish` and then promoted by a maintainer with two-factor authentication (2FA) enabled.

#### Option A: Direct publish (full publish token, npm 10.x)

```bash
# Publish core first
cd packages/core
npm publish --access public

# Then themes
cd ../themes/captain-america
npm publish --access public

cd ../caramel
npm publish --access public
```

`@higgsboson/utils` is **internal-only** and **not published** to npm.

#### Option B: Staged publish (stage-only token, requires npm 12+)

If your token is stage-only, stage each package first. **Note:** `npm stage publish/promote` requires npm 12+. Node 24 LTS ships with npm 11.x — upgrade manually:

```bash
npm install -g npm@12
npm --version  # should print 12.x.x
```

Then stage:

```bash
# Stage all packages
npm run publish:stage:all
```

After staging, a maintainer with 2FA enabled must promote each staged version:

```bash
# Promote all packages
npm run publish:promote:all
```

Or promote individual packages:

```bash
npm run publish:promote:core
npm run publish:promote:captain-america
npm run publish:promote:caramel
```


**To get a full publish token:** Go to https://www.npmjs.com/settings/TOKENS, create a new "Automation" token with **Read + Publish** access (not "Read + Publish (stage-only)"), and enable 2FA on your npm account.

**Required:** Set `NPM_TOKEN` in your environment (GitHub Actions secret or local env). The `.npmrc` references it:

```
registry=https://registry.npmjs.org/
access=public
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

### 6. Create GitHub/Codeberg release

After pushing the tag, create a release on the forge:
- Tag: `v1.0.0`
- Title: `v1.0.0`
- Body: copy from `CHANGELOG.md`
- Mark as "latest"

---

## Changelog Convention

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types that trigger version bumps:

| Type | Bump | Example |
|------|------|---------|
| `fix:` | Patch | `fix: resolve step divider rendering` |
| `feat:` | Minor | `feat: add tooltip component` |
| `feat!:`, `fix!:` etc. | Major | `feat!: change core API` |
| Any commit with `BREAKING CHANGE:` in body/footer | Major | — |

Other types (`chore:`, `docs:`, `refactor:`, `style:`, `test:`, `build:`, `ci:`, `perf:`) do not trigger a version bump but are included in the changelog.

### Example commit history → changelog

```
feat: add step component with 66 examples
fix: resolve table row chaining for classless trs
chore: update dependencies
```

Generates:

```markdown
### Features

* add step component with 66 examples ([#...](...))

### Bug Fixes

* resolve table row chaining for classless trs ([#...](...))
```

---

## Pre-Release Checklist

- [ ] All tests pass: `npm run test:utils`
- [ ] Lint passes: `npm run pre-push`
- [ ] All packages build: `npm run build`
- [ ] `.nvmrc` matches the Node version used for building (currently `v24.22.1`)
- [ ] `CHANGELOG.md` is generated and reviewed
- [ ] `NPM_TOKEN` is set in the publishing environment
- [ ] Core is published before themes
- [ ] Git tag is pushed with `--follow-tags`

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 0.1.0 | 2026-10-23 | Initial development, all 30 components migrated to new render pipeline |
