# PR Description: First Release + npm Publish

## Overview

Prepare Higgsboson for its first public release by making all 4 workspaces publishable to npm as separate scoped packages, adding automated changelog generation via `standard-version`, and documenting the full release process.

## Changes

### 1. Root `package.json`
- Added `homepage`, `repository`, `bugs`, `keywords`, `engines` (node >=24, npm >=10)
- Added `publishConfig: { access: "public" }`
- Added `standard-version` to devDependencies
- Added `jsdom` to devDependencies (test dependency)
- Added release scripts: `release`, `release:patch`, `release:minor`, `release:major`
- Added missing `lint`, `lint:core:default`, `lint:theme:captain-america`, `lint:theme:caramel`, `pre-push` scripts
- Fixed `test:utils` typo (`npm run test--workspace` → `npm run test --workspace`)

### 2. `packages/core/package.json`
- Added `homepage`, `repository` (with `directory`), `bugs`, `keywords`, `engines`
- Added `publishConfig: { access: "public" }`
- Added `main` + `style` fields pointing to built CSS
- Added `files: ["dist/", "README.md"]` for npm include list

### 3. `packages/themes/captain-america/package.json`
- Same publish metadata as core
- Added `peerDependencies: { "@higgsboson/core": "^0.1.0" }` + `peerDependenciesMeta` (optional)
- Added `main` + `style` fields

### 4. `packages/themes/caramel/package.json`
- Same as captain-america theme

### 5. `packages/utils/package.json`
- Added `homepage`, `repository` (with `directory`), `bugs`, `keywords`, `engines`
- Added `publishConfig: { access: "public" }`
- Added `exports` field for ESM entry point
- Added `files: ["src/", "README.md"]`
- Added `lint` script for eslint on `src/*.mjs`

### 6. `.npmrc` (new)
- `registry=https://registry.npmjs.org/`
- `access=public`
- Auth token via `${NPM_TOKEN}` env var

### 7. `.versionrc.json` (new)
- standard-version configuration with conventional commit types
- `packageFiles` lists all 5 package.json files for version bumping
- `CHANGELOG.md` output

### 8. `RELEASE.md` (new)
- Complete release workflow documentation
- Package structure table for consumers (split install)
- Conventional Commits convention table
- Pre-release checklist
- Publish order (core → themes → utils)
- npm token requirement

### 9. Component HTML files restored
- All 30 component `.html` files restored to new pipeline (`render(model)` + `addMarkupHeaders(model)`)
- Removed legacy `.mjs` files: `avatar.mjs`, `box.mjs`, `list.mjs`
- Removed `text/texts.html` (dead link)

### 10. `renderStory.mjs` fix
- Added `// eslint-disable-next-line no-undef` for pre-existing dead-code error

### 11. `AGENTS.md` update
- Added release process section
- Updated constraints (package.json changes expected for release)
- Updated test count to 105/105

## Consumer Usage

```bash
# Core only
npm install @higgsboson/core

# Core + theme (both required for themed styling)
npm install @higgsboson/core @higgsboson/theme-captain-america
npm install @higgsboson/core @higgsboson/theme-caramel
```

## Release Commands

```bash
# Cut a release (patch/minor/major)
npm run release:patch    # bug fixes
npm run release:minor    # new features
npm run release:major    # breaking changes

# Push with tags
git push origin main --follow-tags

# Publish (core first, then themes)
cd packages/core && npm publish --access public
cd packages/themes/captain-america && npm publish --access public
cd packages/themes/caramel && npm publish --access public
cd packages/utils && npm publish --access public
```

## Testing

- `npm run test:utils` → 105/105 passing
- `npm run pre-push` → lint passes on all workspaces
