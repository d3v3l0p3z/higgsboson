# Skill: create-component

## Description

How to add a new Higgsboson core component with the full file set (`html`, `css`, `md`, `model`, `mock`) and wire it into the dev playgrounds and menus.

## 1. Plan

- Component folder: `packages/core/src/components/<name>/` (singular, kebab-case — e.g. `box`, `tooltip`; legacy plurals like `buttons` exist, don't add new ones).
- Root class: `hggs-<name>`. Modifiers: `hggs-<name>--<modifier>` (e.g. `hggs-box--rounded`, `hggs-box--primary`).
- Tokens: follow `.skills/name-css-token.md` (component token pattern `--<name>-<property>[-<modifier>[-<state>]]` with a core default fallback).

## 2. Create the file set (5 files)

```
packages/core/src/components/<name>/
  ├─ <name>.css
  ├─ <name>.html
  ├─ <name>.md
  ├─ <name>-mock.html   ← generated, never hand-written
  └─ <name>-model.mjs
```

### `<name>.css`

Use nested selectors; every themable value goes through a component token with a core fallback:

```css
.hggs-example {
  color: var(--example-color, var(--hggs-font-color-default));
  padding: var(--example-padding, var(--hggs-space-default));

  &.hggs-example--rounded {
    border-radius: var(--example-border-radius-with-radius, var(--hggs-border-radius-default));
  }
}
```

Import it in `packages/core/src/index.css` (component section).

### `<name>-model.mjs`

```js
export const exampleModel = {
  title: "Example",
  cases: [
    "Example",
    "Example rounded",
  ],
  nodes: [
    {
      tag: "div",
      classNames: [
        "hggs-example",
        "hggs-example hggs-example--rounded",
      ],
      labels: null,
      next: null,
    },
  ],
};

export default exampleModel;
```

Renderer semantics (one entry per case in `classNames`/`labels`, `next` = children, `prev` chains for table rows, `[""]` for empty labels): see `packages/utils/README.md`.

### `<name>.html`

Exact template — no Prism, no `<pre><code>`, no inline styles:

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

### `<name>.md`

Fixed section order (match the other component docs):

```md
# Example

## Root component class name

`hggs-example`

## Theme selector

```css
.hggs-example {
  /*
  ... put here variables ...
  */
}
```

## Component variables

```
--example-color
--example-padding
--example-border-radius-with-radius
```

## HTML Structure

### Default

#### Basic HTML structure

```html
<div class="hggs-example">...</div>
```
```

## 3. Register in the menus

Add an entry to **all three** `higgsboson.json` manifests (same name/path in each):

- `packages/core/higgsboson.json`
- `packages/themes/captain-america/higgsboson.json`
- `packages/themes/caramel/higgsboson.json`

```json
{
  "name": "Example",
  "path": "./src/components/<name>/<name>.html",
  "new": false
}
```

(Ask the user before editing `higgsboson.json` if unsure.)

## 4. Theme stubs

For each theme, add `packages/themes/<theme>/src/components/<name>.css` overriding the component tokens inside the selector (see `.skills/create-theme.md`), and `@import` it in the theme's `src/index.css`.

## 5. Generate the mock and verify

```bash
# generate <name>-mock.html (never hand-write it)
npm run mocks:update --workspace packages/utils <name>

# verify golden tests + file-set enforcement
npm run test:utils

# lint and format
npm run lint
npx prettier --write packages/core/src/components/<name>/
```

## Checklist

- [ ] 5 files present: `.html`, `.css`, `.md`, `-model.mjs`, `-mock.html`
- [ ] `.css` imported in `packages/core/src/index.css`
- [ ] Tokens follow `.skills/name-css-token.md` and are listed in `<name>.md`
- [ ] Entry added to all 3 `higgsboson.json` manifests
- [ ] Theme stubs + imports added in both themes
- [ ] Mock generated (not hand-written), `npm run test:utils` passes (105 + new tests)
- [ ] `npm run lint` clean, prettier applied
