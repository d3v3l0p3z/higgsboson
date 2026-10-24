# Skill: name-css-token

## Description

How to name tokens (CSS custom properties) across the three Higgsboson token layers: core default tokens, component tokens and theme tokens. Follow this before inventing any new `--*` property.

## The three token layers

| Layer | Where | Naming | `-default` suffix |
|-------|-------|--------|-------------------|
| Core default tokens | `packages/core/src/theme/vars.css` | `--hggs-<property>-<qualifier>-default` | **Yes (mandatory)** |
| Component tokens | `packages/core/src/components/<name>/<name>.css` | `--<component>-<property>[-<modifier>[-<state>]]` | No |
| Theme tokens | `packages/themes/<theme>/src/vars.css` | `--hggs-<property>[-<qualifier>]` (recommended) | No |

---

## 1. Core default tokens (strict convention)

These are the base API of the default theme. **You must follow the existing convention** — do not invent new shapes.

```
--hggs-border-primary-default
  ──── ────── ─────── ───────
    ▲     ▲       ▲      ▲
  prefix property modifier suffix
```

Rules:
- Always kebab-case.
- Always end with `-default`.
- Property families in use (do not create new families without asking):

| Family | Count | Examples |
|--------|-------|---------|
| `color` | 78 | `--hggs-color-white-default`, `--hggs-color-gray-014-default`, `--hggs-color-primary-hover-default` |
| `border` | 29 | `--hggs-border-default`, `--hggs-border-auxiliary-gray-006-default` |
| `font` | 22 | `--hggs-font-size-lg-default`, `--hggs-font-color-default`, `--hggs-font-family-default` |
| `filter` | 14 | `--hggs-filter-*` |
| `icon` | 13 | `--hggs-icon-*` |
| `space` | 12 | `--hggs-space-default`, `--hggs-space-md-default`, `--hggs-space-lg-default` |
| `line` | 12 | `--hggs-line-*` |
| `layer`, `shadow`, `logo`, `animation`, `transition`, `transform` | small | `--hggs-shadow-default`, `--hggs-layer-*` |

Size qualifiers: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`.
Gray scale: `--hggs-color-gray-001-default` … `--hggs-color-gray-020-default` (3-digit, zero-padded).
State qualifiers: `hover`, `focus`, `active`, `disabled`.

## 2. Component tokens

Each component may expose its own tokens. They live **inline in the component CSS** (not in `vars.css`) and always fall back to a core default token:

```css
.hggs-box {
  color: var(--box-color, var(--hggs-font-color-default));
  padding: var(--box-padding, var(--hggs-space-md-default));
  border-radius: var(--box-border-radius, var(--hggs-border-radius-default));
}
```

Rules:
- Pattern: `--<component>-<css-property>[-<modifier>[-<state>]]`.
- No `hggs` prefix, no `-default` suffix — the component name is the namespace.
- The fallback must always be a core default token (or a literal for non-themable values like `default`).
- Modifier suffix describes the variant: `--button-background-primary`, `--box-border-radius-with-radius`.
- State suffix goes last: `--button-background-primary-hover`, `--input-border-focus`, `--input-border-invalid`, `--input-color-disabled`.
- Every token you introduce **must be documented** in the component's `.md` under `## Component variables`.

Real examples:

```
--box-background
--box-background-primary
--box-header-border-bottom-primary
--button-font-size-medium
--button-border-outline-quaternary-hover
--input-padding-big
--table-wrapper-box-shadow
```

## 3. Theme tokens

Themes remap component tokens through their own variable layer. Naming is **free by default**, but the recommended convention (used by both shipped themes) drops the `-default` suffix:

```
--hggs-border-primary
  ──── ────── ───────
    ▲     ▲       ▲
  prefix property modifier
```

Themes consume them by overriding component tokens **inside the component selector** (never re-declare the whole rule):

```css
/* packages/themes/caramel/src/components/box.css */
.hggs-box {
  --box-background: var(--hggs-color-background);
  --box-border: var(--hggs-border);
  --box-padding: var(--hggs-space-2xl) var(--hggs-space);
  --box-border-radius-with-radius: var(--hggs-border-radius-md);
}
```

Flow: **core default token → component token (with fallback) → theme token override**.

---

## Checklist for a new token

- [ ] Right layer? (base value → core `vars.css`; per-component knob → component CSS; theme look → theme `vars.css`)
- [ ] Core token: `--hggs-<property>-<qualifier>-default`, existing family, kebab-case?
- [ ] Component token: `--<component>-<property>[-<modifier>[-<state>]]` with a core default fallback?
- [ ] Documented in the component `.md` `## Component variables`?
- [ ] Theme override placed inside the component selector in the theme's `src/components/<name>.css`?

See also: `.skills/create-component.md`, `.skills/create-theme.md`.
