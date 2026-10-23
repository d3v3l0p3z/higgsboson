# AGENTS.md — Higgsboson Project Guide for AI Agents

This file describes everything an AI agent needs to know to work effectively on the Higgsboson project. Read it before making changes.

---

## 1. Project Overview

**Higgsboson** is a themeable, semantic, classless CSS framework to style core native HTML components.

- Monorepo with workspaces: `packages/core`, `packages/themes/*`, `packages/utils`
- Remote: `git@codeberg.org:higgsboson/higgsboson.git` (default branch: `main`)
- Current feature branch: `FRE-282-supplier-selection-table-status-screen-layout`
- Node version: see `.nvmrc` (currently `v24.22.1` LTS / Krypton)

---

## 2. Repository Structure

```
packages/
├─ core/
│  ├─ src/
│  │  ├─ components/       ← 30 migrated components (each has own folder)
│  │  ├─ theme/            ← default theme (vars.css, index.css, resets.css, assets/)
│  │  ├─ index.css
│  │  └─ getConfiguration.mjs, loadThemeStyles.mjs, etc.
│  ├─ index.html           ← dev playground (do not touch)
│  ├─ higgsboson.json      ← component menu manifest
│  └─ package.json         ← do not touch
├─ themes/
│  ├─ captain-america/
│  │  ├─ src/components/*.css
│  │  ├─ index.html        ← do not touch
│  │  ├─ higgsboson.json   ← component menu manifest
│  │  └─ package.json      ← do not touch
│  └─ caramel/
│     ├─ ...same structure...
├─ utils/
│  ├─ src/
│  │  ├─ render.mjs             ← core renderer: render(model)
│  │  ├─ addMarkupHeaders.mjs   ← page decorator: h1 + h2 per example
│  │  ├─ addComponentsMenuDomNode.mjs
│  │  ├─ getConfiguration.mjs
│  │  ├─ loadThemeStyles.mjs
│  │  ├─ getInKebabCaseFormat.mjs
│  │  ├─ mockHelpers.mjs        ← normalizeElementTree, diffElementTrees
│  │  ├─ updateMocks.mjs        ← CLI to regenerate mocks
│  │  ├─ index.mjs              ← public exports (7 active modules)
│  │  ├─ addMarkupHeaders.test.mjs
│  │  ├─ render.test.mjs
│  │  └─ mocks.test.mjs         ← golden tests for all components
│  ├─ README.md
│  └─ package.json              ← do not touch
```

---

## 3. Component Model (30 Components)

Every migrated component in `packages/core/src/components/<name>/` ships:

| File | Purpose |
|------|---------|
| `<name>.html` | New pipeline page — loads model, calls `render(model)` + `addMarkupHeaders(model)` |
| `<name>-model.mjs` | Declarative model: `{ title, cases, nodes: [{tag, classNames, labels, next}] }` |
| `<name>-mock.html` | Generated golden file (expected DOM output) |
| `<name>.css` | Component styles |
| `<name>.md` | Documentation |

**Migrated components (30/30):**
`avatar`, `avatars`, `blockquote`, `box`, `buttons`, `checkbox`, `dialog`, `divider`, `dropdown`, `field`, `flex`, `form`, `grid`, `icons`, `inputs`, `label`, `link`, `list`, `logo`, `option`, `radio`, `select`, `step`, `steps`, `switch`, `table`, `tag`, `text`, `titles`, `tooltip`

**NOT migrated (out of scope):** `app/` (CSS-only shell)

---

## 4. Component Page Template (Required Pattern)

Every component `.html` must follow this exact structure:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>hggs-<name></title>
</head>
<body>
  <div id="hggs-root"></div>
</body>
<!-- render component -->
<script type="module">
  import addMarkupHeaders from "../../../addMarkupHeaders.mjs";
  import getConfiguration from "../../../getConfiguration.mjs";
  import loadThemeStyles from "../../../loadThemeStyles.mjs";
  import render from "../../../render.mjs";
  import model from "./<name>-model.mjs";

  const configuration = await getConfiguration("../../../");

  render(model);
  addMarkupHeaders(model);
  loadThemeStyles(configuration);
</script>
</html>
```

Rules:
- No Prism CDN, no `<pre><code>` blocks, no inline styles on examples
- `addMarkupHeaders(model)` injects `h1` (page title) + `h2` per example (case heading)
- No git commands were allowed during the migration session (now permitted)

---

## 5. Testing

### Commands
```bash
npm run test:utils          # runs all utils tests (107/107 passing)
npm run mocks:update --workspace packages/utils <names>   # regenerate mocks
npm run dev:core:default    # dev server on port 8000
```

### Test types
1. **mocks.test.mjs** — renders every model, diffs against its `<name>-mock.html` (golden)
2. **render.test.mjs** — unit tests for renderer internals (getDescriptions, kebab-case IDs, etc.)
3. **addMarkupHeaders.test.mjs** — tests h1/h2 injection, case labels, rebuild behavior

### Regenerating mocks
```bash
npm run mocks:update --workspace packages/utils box list step
# or all: npm run mocks:update:utils
```

---

## 6. Constraints & Rules (Do Not Touch)

These files/areas were explicitly off-limits during migration and should generally be left alone:

| File/Area | Reason |
|-----------|--------|
| Root `README.md` | User's own uncommitted edits — do not touch |
| Root `index.html` | User's own uncommitted edits — do not touch |
| `packages/core/index.html` | Do not touch |
| Theme `index.html`s (captain-america, caramel) | Do not touch |
| Any `package.json` | Do not touch |
| `packages/utils/src/*` legacy files | Already cleaned — only 7 active modules remain |
| `packages/core/dist/*` | Build output |
| `packages/core/src/components/app/` | CSS-only shell, out of scope |

### Legacy pipeline — fully removed
- No `renderComponentDeprecated`, `setGlobalHelpers`, `getStyles`, `getClasses`, `underscore` references remain in component code
- 7 legacy utils files deleted: `renderComponentDeprecated.mjs`, `renderTemplateIntoBodyDomNode.mjs`, `setGlobal.mjs`, `setGlobalDataModel.mjs`, `setGlobalHelpers.mjs`, `devPlaygroundClasses.mjs`, `devPlaygroundStyles.mjs`, `domHelpers.mjs`
- `packages/utils/src/index.mjs` exports only 7 active modules

---

## 7. ESLint Baseline (Pre-existing)

The repo has pre-existing ESLint errors (~168) from CJS config files (`require`, `module`, `process`, `console` no-undef). These are **not** introduced by new code. All new `*-model.mjs` files lint clean.

When running eslint, expect pre-existing errors. Do not try to "fix" them unless asked.

---

## 8. Common Workflows

### Add/modify a component
1. Create `<name>-model.mjs` with `{ title, cases, nodes }`
2. Create `<name>.html` using the template above
3. Run `npm run mocks:update --workspace packages/utils <name>` to generate `<name>-mock.html`
4. Run `npm run test:utils` to verify
5. Optionally run `npx prettier --write` on the component folder

### Check latest LTS Node version
```bash
npm view node dist-tags --json
# Compare with .nvmrc
```

**Note:** `npm stage publish/promote` requires **npm 12+**. Node 24 LTS ships with npm 11.x. Upgrade manually:

```bash
npm install -g npm@12
npm --version  # should print 12.x.x
```

### Start dev server
```bash
npm run dev:core:default   # port 8000
```

---

## 9. Skills Available

- `.skills/upgrade-node-version.md` — instructions for upgrading Node to latest LTS

---

## 10. Git Conventions

- Commit messages follow conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `merge:`
- All migration work is uncommitted on `FRE-282-supplier-selection-table-status-screen-layout` until merged
- Do not commit user's uncommitted edits to root `README.md`/`index.html`

---

## 11. Quick Reference

| Task | Command |
|------|---------|
| Run all tests | `npm run test:utils` |
| Regenerate mocks | `npm run mocks:update --workspace packages/utils <name>` |
| Dev server | `npm run dev:core:default` |
| Prettier format | `npx prettier --write <files>` |
| Check LTS Node | `npm view node dist-tags --json` |
| Check test status | `105/105 passing` |

---

## 12. When in Doubt

- Check `.skills/upgrade-node-version.md` for Node-related tasks
- Check existing component folders for patterns (especially `box`, `step`, `steps`, `table`, `grid`, `tooltip` for complex migration examples)
- The test suite is the source of truth: if `npm run test:utils` passes (107/107), the change is safe
- Ask the user before editing `higgsboson.json` manifests or touching files in the "Do Not Touch" list

---

## 14. Release Process

See `RELEASE.md` for the full release and npm publish workflow.

**Summary:**
- We use [standard-version](https://github.com/conventional-changelog/standard-version) for automated semantic versioning
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
- `npm run release:patch` / `release:minor` / `release:major` to cut a release
- `npm publish --access public` for core and themes only (utils not published)
- Themes declare `@higgsboson/core` as a `peerDependency` — consumers install them separately

### Package structure (split for consumers)

| Package | npm name | Contains |
|---------|----------|----------|
| `packages/core` | `@higgsboson/core` | Core CSS classes (required by all themes) |
| `packages/themes/captain-america` | `@higgsboson/theme-captain-america` | Captain America theme |
| `packages/themes/caramel` | `@higgsboson/theme-caramel` | Caramel theme |
| `packages/utils` | `@higgsboson/utils` | Renderer + utils (**not published**, internal only) |

### Publish order
1. `@higgsboson/core` (themes peer-depend on it)
2. `@higgsboson/theme-captain-america`
3. `@higgsboson/theme-caramel`

`@higgsboson/utils` is **internal-only** and **not published** to npm.

---

## 15. Constraints & Rules (Updated)

**package.json files** were updated for publish config (access: public, files, engines, peerDependencies) — this is expected for release.

Files still off-limits:
| File/Area | Reason |
|-----------|--------|
| Root `README.md` | User's own uncommitted edits — do not touch |
| Root `index.html` | User's own uncommitted edits — do not touch |
| `packages/core/index.html` | Do not touch |
| Theme `index.html`s (captain-america, caramel) | Do not touch |
| `packages/core/dist/*` | Build output |
| `packages/core/src/components/app/` | CSS-only shell, out of scope |

---

## 16. Quick Reference (Updated)

| Task | Command |
|------|---------|
| Run all tests | `npm run test:utils` |
| Regenerate mocks | `npm run mocks:update --workspace packages/utils <name>` |
| Dev server | `npm run dev:core:default` |
| Prettier format | `npx prettier --write <files>` |
| Check LTS Node | `npm view node dist-tags --json` |
| Cut release (patch) | `npm run release:patch` |
| Cut release (minor) | `npm run release:minor` |
| Publish core | `npm run publish:core` |
| Publish theme captain-america | `npm run publish:captain-america` |
| Publish theme caramel | `npm run publish:caramel` |
| Stage all packages | `npm run publish:stage:all` |
| Promote all packages | `npm run publish:promote:all` |
| Check test status | `105/105 passing` |

