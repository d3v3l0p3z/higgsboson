# Skill: create-theme

## Description

How to add a new Higgsboson theme package under `packages/themes/<name>/`. A theme is a package that restyles the core components through tokens — it peer-depends on `@higgsboson/core` and never ships its own component markup.

Best starting point: **copy `packages/themes/caramel/`** (cleanest reference) and rename throughout.

## 1. Package skeleton

```
packages/themes/<name>/
  ├─ src/
  │    ├─ assets/               ← images, svgs, fonts of the theme
  │    ├─ components/           ← one <component>.css per core component
  │    ├─ fonts.css             ← @font-face / font imports
  │    ├─ index.css             ← entry point (imports everything below)
  │    ├─ resets.css            ← theme resets (if needed)
  │    └─ vars.css              ← theme tokens
  ├─ .gitignore
  ├─ .stylelintignore
  ├─ .stylelintrc
  ├─ bs-config.json
  ├─ higgsboson.json
  ├─ index.html                 ← dev playground (copied, then yours)
  ├─ LICENSE
  ├─ package.json
  └─ postcss.config.js
```

## 2. package.json

Key properties (copy from caramel and adjust `<name>`, kebab-case):

- `name`: `@higgsboson/theme-<name>`
- `config.output_filename`: `higgsboson-theme-<name>`
- `main` / `style`: `dist/higgsboson-theme-<name>.min.css`
- `files`: `["dist/", "README.md"]`
- `peerDependencies`: `"@higgsboson/core": "^0.1.0"` (+ `peerDependenciesMeta` optional entry)
- `publishConfig.access`: `public`
- `engines`: `node >=24`, `npm >=12`
- scripts (identical shape, only the `publish:promote` scope changes):
  - `build`, `build:watch`, `format`, `lint`, `server:start`, `dev`
  - `publish:stage`: `npm stage publish --access public`
  - `publish:promote`: `npm stage promote @higgsboson/theme-<name>@$npm_package_version --from=stage --to=latest`

`postcss.config.js`: copy verbatim (prod = stylelint quiet + preset-env + import + copy-assets + nesting + autoprefixer + cssnano; dev = same without minify + reporter).

`bs-config.json`: copy, but use a **unique port** (core `8000`, captain-america `8001`, caramel `8002` → next free, e.g. `8003`). Keep the server bases — they serve the theme plus core's html/utils:

```json
{
  "port": 8003,
  "files": ["./**/*.{html,htm,css,svg,mjs,js,json}"],
  "server": ["./", "../../utils/src", "../../core"],
  "ui": false
}
```

## 3. Theme tokens — `src/vars.css`

Declare your theme tokens (naming per `.skills/name-css-token.md`, recommended `--hggs-<property>[-<qualifier>]` **without** `-default`):

```css
:root {
  --hggs-color: var(--hggs-color-gray-003);
  --hggs-color-background: #fff;
  --hggs-space: 1rem;
  --hggs-space-lg: 2rem;
  ...
}
```

## 4. Component overrides — `src/components/*.css`

One file per core component. **Never re-declare component rules** — only override the component tokens inside the selector:

```css
/* src/components/box.css */
.hggs-box {
  --box-background: var(--hggs-color-background);
  --box-border: var(--hggs-border);
  --box-padding: var(--hggs-space-2xl) var(--hggs-space);
  --box-border-radius-with-radius: var(--hggs-border-radius-md);
}
```

## 5. `src/index.css` entry point

Import order matters (resets → fonts → theme vars → component overrides):

```css
/* Resets */
@import url("./resets.css");

/* Fonts */
@import url("./fonts.css");

/* Theme Variables */
@import url("./vars.css");

/* Components Variables */
@import url("./components/flex.css");
@import url("./components/box.css");
/* ...one import per component css... */
```

## 6. Playground and menu

- `index.html`: copy from an existing theme (it's your new file — the "do not touch" rule only protects the existing playgrounds).
- `higgsboson.json`: copy core's menu, change only `outputFilename` to `higgsboson-theme-<name>`. Menu paths stay `./src/components/<name>/<name>.html` — the html is served from core through the lite-server bases.

## 7. Root wiring

The `packages/themes/*` workspace glob picks the package up automatically, but add the root scripts:

| Root script | Command to add |
|-------------|----------------|
| `build:theme:<name>` | `npm run build --workspace packages/themes/<name>` |
| `dev:theme:<name>` | `concurrently "npm run dev:core:default" "npm run dev --workspace packages/themes/<name>"` |
| `lint:theme:<name>` | `npm run lint --workspace packages/themes/<name>` |
| `format:theme:<name>` | `npm run format --workspace packages/themes/<name>` |
| `publish:<name>` | `npm publish --workspace packages/themes/<name>` |
| `publish:stage:<name>` | `npm run publish:stage --workspace packages/themes/<name>` |
| `publish:promote:<name>` | `npm run publish:promote --workspace packages/themes/<name>` |

Release wiring:
- `.versionrc.json` → `packageFiles`: add `packages/themes/<name>/package.json`
- `.skills/publish-higgsboson-packages.md` + `RELEASE.md` + README: add the new theme to package tables and the stage/promote/all scripts (extend the `*:all` chains)

## 8. Verify

```bash
npm run lint:theme:<name>
npm run build:theme:<name>
npm run dev:theme:<name>   # core on :8000, theme on its port — compare side by side
npm run test:utils         # must stay green
```

## Checklist

- [ ] Package skeleton copied from caramel, everything renamed to `<name>`
- [ ] Unique `bs-config.json` port
- [ ] `vars.css` theme tokens follow `.skills/name-css-token.md`
- [ ] Every component override only sets component tokens inside the selector
- [ ] `index.css` imports resets → fonts → vars → components
- [ ] `higgsboson.json` menu mirrored, `outputFilename` changed
- [ ] Root scripts added (build/dev/lint/format/publish/stage/promote)
- [ ] `.versionrc.json` `packageFiles` entry added
- [ ] `lint`, `build` and `dev` verified; `test:utils` still green
- [ ] Publish order reminder: `@higgsboson/core` first, themes after

See also: `.skills/name-css-token.md`, `.skills/publish-higgsboson-packages.md`.
