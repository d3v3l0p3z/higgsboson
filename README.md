![[Higgsboson]](images/logo-light.png#gh-light-mode-only)
![[Higgsboson]](images/logo-dark.png#gh-dark-mode-only)

# Higgsboson

Higgsboson is a themeable semantic classeless framework to style core native components.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Stage - Alpha](https://img.shields.io/badge/Stage-Alpha-f9f504)](https://)
![maintained - yes](https://img.shields.io/badge/maintained-yes-blue)

## Summary

- [Higgsboson](#higgsboson)
  - [Summary](#summary)
  - [What is next](#what-is-next)
  - [Why Higgsboson?](#why-higgsboson)
  - [Project Structure](#project-structure)
    - [Packages](#packages)
      - [Core](#core)
        - [Core folder file structure](#core-folder-file-structure)
        - [Default theme.](#default-theme)
          - [assets folder](#assets-folder)
          - [default.css](#defaultcss)
          - [index.css](#indexcss)
        - [Components](#components)
          - [Components docs](#components-docs)
          - [Component files structure](#component-files-structure)
          - [componentA.css](#componentacss)
          - [componentA.html](#componentahtml)
          - [componentA.md](#componentamd)
          - [componentA.mjs](#componentamjs)
      - [Themes](#themes)
        - [Theme folder file structure](#theme-folder-file-structure)
          - [assets](#assets)
          - [components](#components)
          - [fonts.css](#fontscss)
          - [resets.css](#resetscss)
          - [vars.css](#varscss)
          - [index.css](#indexcss)
          - [gitignore](#gitignore)
          - [stylelintignore](#stylelintignore)
          - [stylelintrc](#stylelintrc)
          - [bs-config.json](#bs-configjson)
          - [higgsboson.json](#higgsbosonjson)
          - [index.html](#indexhtml)
          - [LICENSE](#license)
          - [package.json](#packagejson)
          - [postcss.config.js](#postcssconfigjs)
        - [Technical considerations](#technical-considerations)
          - [Complete graph of the ideal higgsboson flow](#complete-graph-of-the-ideal-higgsboson-flow)
        - [Dev a theme](#dev-a-theme)
        - [Use a theme](#use-a-theme)
  - [How to use](#how-to-use)
    - [Install](#install)
    - [Build](#build)
      - [Plugins that we are using in the build process](#plugins-that-we-are-using-in-the-build-process)
    - [Development](#development)
    - [Lint](#lint)
    - [Format](#format)
    - [Pre-push](#pre-push)
      - [Usage](#usage)
  - [Tools that could help you to develop in this project](#tools-that-could-help-you-to-develop-in-this-project)
    - [Visual Studio Code IDE](#visual-studio-code-ide)
      - [Visual Studio Code useful Extensions](#visual-studio-code-useful-extensions)

## What is next

Take a look into the active [project board](https://github.com/users/javierlopezdeancos/projects/3/views/2)
or more deeper view in [issues](https://github.com/javierlopezdeancos/higgsboson/issues).

## Why Higgsboson?

There are many motivations to see this project as a simple research and development of a system that allows not to reinvent the wheel over and over again.

Now, I know that we have multiple techniques and tools in the ecosystem to solve the same problem, many of them on top of the wave, but my intention is to solve the problem from several points of view:

- The most standard way possible, use the web.
- Minimum coupling between internal parts.
- Oriented to his main responsibility, styling pieces on the screen.
- Fully customizable injectable themes.
- Fast propagation of changes.
- Easily articulated in a design system.
- Independent but easily implementable in any library or front end framework.

## Project Structure

The project is a monorepo that has different packages that can build separately using dependencies from the other ones.

```text
Higgsboson
 ├─ packages
      ├─ core
      │   ├─ src
      │     ├─ components
      │     ├─ default-theme
      │
      ├─ themes
      │  ├─ captain-america
      │  ├─ caramel
      │
      ├─ utils
          ├─ src
```

### Packages

Higssboson has different packages that has their own workspace. Those packages are `core`, `themes` and `utils.`

#### Core

Core package contains the core library and the `default-theme`. Building the core package you will use Higgsboson with the default theme.

##### Core folder file structure

```text
├─ core
    ├─ src
       ├─ components
       ├─ default-theme
           ├─ assets
           ├─ default.css
           ├─ index.css
           ├─ resets.css
```

##### Default theme

###### assets folder

Folder to allocate different kind of assets as images, svgs, fonts, icons etc to the default theme.

###### default.css

Theme default has variables as fallback to each `core-component-tokens` to each core component.

Higgsboson themes just works with css standard custom variables but we would like to calls this entire concept `default tokens`.

```css
--theme-token-a-default: #FFFFFF;
--theme-token-b-default: 12px;
  .
  .
  .
--theme-token-n-default: 1px solid var(--theme-token-a);
```

**default tokens convention name**

> [!WARNING]
> Take care here, in the same way that I will explain that for each `theme tokens` you can use the naming convention that you want, in this case, you must follow the existing naming convention.

```
--hggs-border-primary-default
  ──── ────── ─────── ───────
    ▲     ▲       ▲      ▲
    │     │       │      │
    │     │       │      │
    │     │       │      │
    │     │       │      │
  prefix property │     suffix
                  │
                  │
              modifier
```

###### index.css

Use this file as theme entry point. [Import](https://github.com/postcss/postcss-import#readme) here all the default theme files that core need to compose higgsboson as default.

##### Components

All available core components defined from their selectors, properties and values in the form of variables connected to the theme variables or own variables for this component.

###### Components docs

- [Avatar](/packages/core/src/components/avatar/avatar.md)
- [Avatars](/packages/core/src/components/avatar/avatars.md)
- [Blockquote](/packages/core/src/components/blockquote/blockquote.md)
- [Box](/packages/core/src/components/box/box.md)
- [Button](/packages/core/src/components/buttons/buttons.md)
- [Checkbox](/packages/core/src/components/checkbox/checkbox.md)
- [Dialog](/packages/core/src/components/dialog/dialog.md)
- [Divider](/packages/core/src/components/dialog/divider.md)
- [Dropdown](/packages/core/src/components/dropdown/dropdown.md)
- [Field](/packages/core/src/components/field/field.md)
- [Flex](/packages/core/src/components/flex/flex.md)
- [Grid](/packages/core/src/components/grid/grid.md)
- [Icon](/packages/core/src/components/icons/icons.md)
- [Input](/packages/core/src/components/inputs/input.md)
- [Label](/packages/core/src/components/label/label.md)
- [Link](/packages/core/src/components/link/link.md)
- [List](/packages/core/src/components/list/list.md)
- [Logo](/packages/core/src/components/logo/logo.md)
- [Option](/packages/core/src/components/option/option.md)
- [Radio](/packages/core/src/components/radio/radio.md)
- [Select](/packages/core/src/components/select/select.md)
- [Step](/packages/core/src/components/step/step.md)
- [Steps](/packages/core/src/components/steps/steps.md)
- [Switch](/packages/core/src/components/switch/switch.md)
- [Table](/packages/core/src/components/table/table.md)
- [Tag](/packages/core/src/components/tag/tag.md)
- [Text](/packages/core/src/components/text/text.md)
- [Texts](/packages/core/src/components/text/texts.md)
- [Titles (h1, h2, h3, h4, h5, h6)](/packages/core/src/components/titles/titles.md)
- [Tooltip](/packages/core/src/components/tooltip/tooltip.md)

###### Component files structure

```text
components
   ├─ componentA
        ├─ componentA.css
        ├─ componentA.html
        ├─ componentA.md
        ├─ componentA.mjs
```

###### componentA.css

Selectors, rules, properties and values to this component scoped by selector and **connected with the theme API across component variables and default theme API variables**.

###### componentA.html

Html markup generated with [underscore](https://underscorejs.org/) + [our custom utils](./packages/utils/src/) + an .mjs module with the component data model.

###### componentA.md

Complete documentation about **component theme API variables**, **component theme API selectors** and markup component use cases.

###### componentA.mjs

A javascript module with the data model to render with underscore and our custom utils all our component use cases.

#### Themes

A Higgsboson theme is not more than **a package that contains the theme variables, the theme components variables that should connect with the core components interfaces and the theme entry point**.

There are different workspaces with packages with themes examples to review.

Building each of this themes in their owns workspaces you can use Higgsboson with your theme imported on top of Higgsboson core build imported.

> [!NOTE]
> So take into account that to use a theme you should build the core package and the theme package. If you run the script to run the dev environment to a theme, the script run the core package build and the theme package build separately.

Themes are the area where everything related to theming (not default styling) should be managed.

##### Theme folder file structure

```text
theme
 │ ├─ src
 │     ├─ assets
 │     ├─ components
 │     │    ├─ app.css
 |     |    ├─ blockquote.css
 │     │    ├─ box.css
 │     │    ├─ button.css
 │     │    ├─ checkbox.css
 │     │    ├─ dialog.css
 │     │    ├─ divider.css
 │     │    ├─ dropdown.css
 │     │    ├─ field.css
 │     │    ├─ flex.css
 │     │    ├─ form.css
 │     │    ├─ grid.css
 │     │    ├─ icon.css
 │     │    ├─ input.css
 │     │    ├─ label.css
 │     │    ├─ link.css
 │     │    ├─ list.css
 │     │    ├─ logo.css
 │     │    ├─ option.css
 │     │    ├─ radio.css
 │     │    ├─ select.css
 │     │    ├─ step.css
 │     │    ├─ table.css
 │     │    ├─ tag.css
 │     │    ├─ text.css
 │     │    ├─ titles.css
 │     │    ├─ tooltip.css
 │     │
 │     ├─ fonts.css
 │     ├─ index.css
 │     ├─ resets.css
 │     ├─ vars.css
 │
 │
 ├─ .gitignore
 ├─ .stylelintignore
 ├─ .stylelintrc
 ├─ bs-config.json
 ├─ higgsboson.json
 ├─ index.html
 ├─ LICENSE
 ├─ package.json
 ├─ postcss.config.js
```

###### assets

Folder to allocate different kind of assets as images, svgs, fonts, icons etc.

###### components

Theme component interfaces to connect and style different core components from the core package.

All those theme component interfaces **should composed with the same pattern**:

All should be wrapped by a core `component scope selector`

```css
.component-scope-selector {
  /* ... */
}
```

Inside this `component scope selector` we should define the different values **aka tokens** to the core component tokens available.

To define this different values we could use values it self or a `theme-token`.

```css
.component-scope-selector {
  --core-component-token-available-a: var(--theme-token);   /* A theme token */
  --core-component-token-available-b: 12px;                 /* A value       */
}
```

**You can review the core component tokens available** taking a walk across [core components documentation](#components-docs).

```css
.component-scope-selector {
  --core-component-token-a: var(--theme-variable-a);
  --core-component-token-b: var(--theme-variable-b);
  --core-component-token-c: calc(var(--theme-variable-a)*2);
  /*
        .
        .
        .
  */
  --core-component-token-n: var(--theme-variable-n);
}
```

Or review the [captain-america theme components scope selectors example](./packages/themes/captain-america/src/components/) or the [caramel theme components scope selectors example](./packages/themes/caramel/src/components/).

###### fonts.css

Set here all theme [@font-face](https://developer.mozilla.org/es/docs/Web/CSS/@font-face) or [@import url](https://developer.mozilla.org/es/docs/Web/CSS/@import) that import font files or font css styles to your theme fonts.

###### resets.css

Set here all your css theme resets styles if you needed.

###### vars.css

Put here all your theme variables to populate with them your theme component interfaces.

Higgsboson themes just works with standard css custom variables but we would like to calls this entire concept `theme tokens`.

```css
:root {
  --theme-token-a: #FFFFFF;
  --theme-token-b: 12px;
  /*
       .
       .
       .
  */
  --theme-token-n: 1px solid var(--theme-token-a);
}
```

**theme tokens convention name**

The good point in how higgsboson is doing things is that you can use your own theme tokens convention name. This layer is a layer that you can build in your way but, if you want to use the default theme tokens convention name, you should follow this pattern:

```
--hggs-border-primary
  ──── ────── ───────
    ▲     ▲       ▲
    │     │       │
    │     │       │
    │     │       │
    │     │       │
  prefix property │
                  │
                  │
              modifier
```

###### index.css

Use this file as theme entry point. [Import](https://github.com/postcss/postcss-import#readme) here all your theme files that you need to compose your theme on top of higgsboson.

###### .gitignore

Set here all ignore files to the theme workspace package.

###### .stylelintignore

Set here all style rules ignore files to the theme workspace package.

###### .stylelintrc

Set the stylelint rules configuration to the theme workspace package.

###### bs-config.json

Higgsboson use a [lite server](https://github.com/johnpapa/lite-server) to run a dev playground to see how it is going and develop your theme components.

This is the [configuration file](https://github.com/johnpapa/lite-server#custom-configuration) that helps you tu run your dev playground.

Usually a `bs-config.json` to a higgsboson theme package should be like:

```json
{
  // browser port
  "port": 8001,
  // files extensions to be serve
  "files": ["./**/*.{html,htm,css,svg,mjs,js,json}"],
  // files paths to be serve
  "server": ["./", "../../utils/src", "../../core"]
}
```

###### higgsboson.json

This file is responsible for manage some of the theme workspace package configuration.

- `outputPath`: Set the output path to the theme build.
- `outputFilename`: Set the output filename to the theme build.
- `componentsMenuItems`: Set the components menu items data to the theme dev playground.

```json
{
  "outputPath": "../../../dist/",
  "outputFilename": "higgsboson-theme-name",
  "componentsMenuItems": [ {
      "name": "Component A",
      "path": "./src/components/component-a/component-a.html",
      "new": false
    },
    {
      "name": "Component B",
      "path": "./src/components/component-b/component-b.html",
      "new": false
    },
    /*
          .
          .
          .
    */
    {
      "name": "Component N",
      "path": "./src/components/component-n/component-n.html",
      "new": false
    }
  ]
}
```

###### index.html

The file that will be serve by the lite server to see your theme dev playground.

###### LICENSE

Set the license to the theme workspace package.

###### package.json

> [!IMPORTANT]
> Note some particular properties:

- `main`: Set the main css file to the theme build.
- `config`
  - `input_directory_sources_name`: Set the input directory sources name to the theme build.
  - `output_filename`: Set the output filename to the theme build.
  - `output_directory_name`: Set the output directory name to the theme build.

```json
{
  "main": "dist/higgsboson-theme-name.min.css",
  "config": {
    "input_directory_sources_name": "src",
    "output_filename": "higgsboson-theme-name",
    "output_directory_name": "dist"
  },
}
```

The theme package should have this scripts into his life cycle:

```json
"scripts": {
  "build": ,
  "build:watch":,
  "format": ,
  "lint":,
  "server:start":,
  "dev":
}
```

> [!TIP]
> Please note that you can build this scripts using all config keys defined previously in the `package.json` file.

Use:

- [stylelint](https://stylelint.io/) to lint your css files.
- [stylelint](https://stylelint.io/) --fix to format your css files.
- [postcss](https://postcss.org/) to build the css output.
- [lite-server](https://github.com/johnpapa/lite-server) to run the dev playground.
- [concurrently](https://github.com/open-cli-tools/concurrently) to run multiple scripts in parallel.

###### postcss.config.js

File that set the postcss plugins configuration to the theme build.

##### Technical considerations

Technically, **a Higgsboson theme could have its own structure** as long as it maintains the connection to the higgsboson core through its component theme values.

However, for consistency, we describe here what our ideal folder structure and variable names would look like, as well as describe all the pieces needed to complete the ideal higgsboson flow.

###### Complete graph of the ideal higgsboson flow

```
                               THEME
                            ┌──────────────────────────────────────────────────────┐
                            │                                                      │
                            │                ┌───────────────────────────┐         │
                            │                │                           │         │
                            │                │                           │         │
                            │                │       theme vars          │         │
                            │                │     │             │       │         │
                            │                └─────┼─────────────┼───────┘         │
                            │                      │             │                 │
                            │                ┌─────┼──────┐ ┌────┼───────┐         │
                            │                │     │      │ │    │       │         │
                            │                │     ▼      │ │    ▼       │         │
                            │                │ ComponentA │ │ ComponentB │         │
                            └──────────────  │ theme      │ │ theme      ├─────────┘
                                             │ values     │ │ values     │
                                             │    │       │ │    │       │
                                             └────┼───────┘ └────┼───────┘
                                                  │              │
                                             ┌────┼───────┐ ┌────┼───────┐
                                             │    │       │ │    │       │
  CORE                                       │    ▼       │ │    ▼       │
 ┌───────────────────────────────────────────┤ ComponentA │ │ ComponentB ├─────────┐
 │                                           │ theme      │ │ theme      │         │
 │                                           │ properties │ │ properties │         │
 │                                           │    │       │ │     │      │         │
 │                                           └────┼───────┘ └─────┼──────┘         │
 │                                                │               │                │
 │                                  ┌─────────────┼───────┐ ┌─────┼──────────────┐ │
 │                                  │             │       │ │     │              │ │
 │   ┌───────────────────────────┐  │             │       │ │     │              │ │
 │   │                           │  │             ▼       │ │     ▼              │ │
 │   │                     ┌─────┼──┼───────►             │ │                    │ │
 │   │      default vars   │     │  │    COMPONENT A      │ │    COMPONENT B     │ │
 │   │                     │     │  │                     │ │                    │ │
 │   └─────────────────────┼─────┘  │                     │ │        ▲           │ │
 │                         │        │                     │ │        │           │ │
 │                         │        └─────────────────────┘ └────────┼───────────┘ │
 │                         │                                         │             │
 │                         │                                         │             │
 │                         │                                         │             │
 │                         └─────────────────────────────────────────┘             │
 │                                                                                 │
 └─────────────────────────────────────────────────────────────────────────────────┘
```

##### Dev a theme

To develop an example theme (`captain-america`, `caramel`) you should follow this steps:

1. Run `npm run dev:theme:captain-america` or `npm run dev:theme:caramel` to run the dev playground.
2. The playground will run the core package with the default theme in `http://localhost:8000` and the theme package that you choice in `http://localhost:8001` in case that you choice `captain-america` or in `http://localhost:8002` in case that you choice `caramel`.

> [!TIP]
> The core package with the default theme is the base to develop a theme. You can see how the core components are styled with the default theme and how you can apply your theme on top.

##### Use a theme

To use a theme you will have different options:

- Using from a cdn.

  ```html
  <link rel="stylesheet" href="https://{your-cdn.com}/higgsboson-theme-{name}.min.css">
  <link rel="stylesheet" href="https://{your-cdn.com}/higgsboson-core.min.css">
  ```

- Using from your dependencies.

  ```js
  import '@higgsboson/theme-{name}';
  import '@higgsboson/core';
  ```

## How to use

### Install

At first you should install dependencies after install `nodejs` and `git`.

`npm i`

### Build

| Script                       |  Description                                                  |    Output    |
|------------------------------|---------------------------------------------------------------|--------------|
| build                        | Build higgsboson in all variantes and themes in prod mode     |  `./packages/core/dist/higgsboson-core.min.css`  |
| build:core:default           | Build higgsboson + default theme version in prod mode         |  `./packages/core/dist/higgsboson-core.min.css`  |
| build:theme:captain-america  | Build higgsboson + captain-america theme version in prod mode |  `./packages/themes/captain-america/dist/higgsboson-theme-captain-america.min.css`  |
| build:theme:caramel          | Build higgsboson + caramel theme version in prod mode         |  `./packages/themes/caramel/dist/higgsboson-theme-caramel.min.css`  |

We are using [postcss](https://postcss.org) to transpile the css code into standard
d css code

#### Plugins that we are using in the build process

- [autoprefixer](https://github.com/postcss/autoprefixer)
- [postcss-extend](https://github.com/travco/postcss-extend)
- [postcss-nesting](https://github.com/csstools/postcss-nesting)
- [postcss-import](https://github.com/postcss/postcss-import)
- [postcss-preset-env](https://preset-env.cssdb.org/)
- [postcss-copy-assets](https://github.com/shutterstock/postcss-copy-assets)
- [cssnano](https://cssnano.co/)

### Development

Then to develop purposes we need run one of this scripts:

| Script                      |  Description                                                                        |   Output             |  Port  |
|-----------------------------|-------------------------------------------------------------------------------------|----------------------|---------|
| dev                         | Build higgsboson in all variantes and themes in dev mode running the dev playground | All of the following | 8000, 8001, 8002 |
| dev:core:default            | Build higgsboson + default theme in dev mode running the dev playground             | `./packages/core/dist/higgsboson-core.css` | 8000 |
| dev:theme:captain-america   | Build higgsboson + captain-america theme in dev mode running the dev playground     | `./packages/themes/captain-america/dist/higgsboson-theme-captain-america.css` | 8000, 8001 |
| dev:theme:caramel           | Build higgsboson + captain-america theme in dev mode running the dev playground     | `./packages/themes/caramel/dist/higgsboson-theme-caramel.css` | 8000, 8002 |

### Lint

You can lint your css files with:

| Script                      |  Description                                                                     |
|-----------------------------|----------------------------------------------------------------------------------|
| lint                        | Lint higgsboson + in all variantes and themes packages files                     |
| lint:core:default           | Lint higgsboson + default theme core package files                               |
| lint:theme:captain-america  | Lint higgsboson + captain-america theme package files                            |
| lint:theme:caramel          | Lint higgsboson + captain-america theme package files                            |

### Format

Fix your linted css files with:

| Script                        |  Description                                                                       |
|-------------------------------|------------------------------------------------------------------------------------|
| format                        | Format higgsboson + in all variantes and themes packages files                     |
| format:core:default           | Format higgsboson + default theme core package files                               |
| format:theme:captain-america  | Format higgsboson + captain-america theme package files                            |
| format:theme:caramel          | Format higgsboson + captain-america theme package files                            |

### Pre-push

**After run `npm i` should be trigger automatically the `npm run prepare` script that is declare in `package.json` that will configure husky pre push hook for you** in order to pass policies about lint before push your changes.

```text
Higgsboson
 ├─ .husky/
 |    ├─ _/
 |    |  ├─ .gitignore
 |    |  ├─ husky.sh
 |    |
 |    ├─ pre-push
 |
 |
    ...
```

#### Usage

If you have permissions when you run `git push` or `git push origin {BRANCH}` the pre-push script should be run automatically running the frontend lint rules.

## Tools that could help you to develop in this project

### Visual Studio Code IDE

Discover a free, built on open source and runs everywhere IDE to frontend development.
[Visual Studio Code](https://code.visualstudio.com/)

#### Visual Studio Code useful Extensions

- [csstools.postcss](https://github.com/csstools/postcss-language)
- [stylelint.vscode-stylelint](https://github.com/stylelint/vscode-stylelint)
- [prettier](https://marketplace.visualstudio.com/publishers/esbenp)
- [errorlens](https://github.com/usernamehw/vscode-error-lens)
