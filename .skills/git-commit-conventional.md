# Skill: git-commit-conventional

## Description
Guidance for creating conventional commit messages following the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/). This project enforces commit format via a `pre-commit` hook using `commitlint` + `@commitlint/config-conventional`.

## Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Rules Enforced

| Rule | Requirement |
|------|-------------|
| `type` | Must be one of: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test` |
| `scope` | Must be one of: `core`, `utils`, `theme-captain-america`, `theme-caramel`, `readme`, `deps`, `ci` |
| `subject` | Required, lowercase, imperative mood, no trailing period |
| `header` | Max 100 characters |
| `body` lines | Max 100 characters each |
| `footer` lines | Max 100 characters each |

## Type → Version Bump Mapping

standard-version reads commit types to determine the next version:

| Type | Semver Bump | Example |
|------|-------------|---------|
| `fix:` | Patch (x.y.Z) | `fix: resolve step divider rendering` |
| `feat:` | Minor (x.Y.0) | `feat: add tooltip component` |
| `feat!:`, `fix!:`, etc. | Major (X.0.0) | `feat!: change core API` |
| Any commit with `BREAKING CHANGE:` in body/footer | Major | — |
| `chore:`, `docs:`, `refactor:`, `style:`, `test:`, `build:`, `ci:` | No bump | Included in changelog only |

## Scope Guidelines

| Scope | When to use |
|-------|-------------|
| `core` | Changes to `packages/core` (renderer, core CSS, core components) |
| `utils` | Changes to `packages/utils` (render.mjs, addMarkupHeaders, mockHelpers, etc.) |
| `theme-captain-america` | Changes to captain-america theme |
| `theme-caramel` | Changes to caramel theme |
| `readme` | Changes to root README.md or component .md docs |
| `deps` | Dependency updates (package.json, package-lock.json) |
| `ci` | CI/CD configuration changes |

## Good Examples

```bash
feat(core): add step component with 66 examples
fix(table): resolve classless tr chaining for rendered output
feat(theme-captain-america): add dark mode variables
docs(readme): add release section to root README
build(deps): upgrade npm to 12.x for stage publish
refactor(utils): simplify getDescriptions in render.mjs
test(utils): add golden test for step model
```

## Bad Examples (will be rejected)

```bash
# Missing type and scope
this is a bad commit message

# Missing subject
feat: 

# Subject with capital letter
Fix(core): Resolve table issue

# Subject with trailing period
fix(core): resolve table issue.

# Invalid type
update(core): change something

# Invalid scope
feat(buttons): add new button

# Header too long
feat(core): this is a very long header that exceeds the 100 character maximum limit and should be rejected by commitlint
```

## Pre-Commit Hook

The `.husky/pre-commit` hook runs `npx commitlint --edit` on every commit. If your commit message doesn't conform, the commit will be **rejected**.

## How to Commit

### Step 1: Stage your changes

```bash
git add <files>
# or
git add -A
```

### Step 2: Commit with a conventional message

```bash
git commit -m "feat(core): add new component"
```

### Step 3: If the hook rejects your commit

Read the error message, fix the commit message, and try again:

```bash
git commit -m "feat(core): add new component"
```

### Multi-line commit (body + footer)

```bash
git commit -m "feat(core): add step component

Add 66 examples across default, small, dot, states, vertical, verticalStates branches.
Includes divider gating, uniqueSibling for identical classes, and classless spans for dot-state entries.

BREAKING CHANGE: step model structure changed from legacy underscore pipeline"
```

## Verification

Before committing, you can test your message locally:

```bash
echo "feat(core): add new component" | npx commitlint --edit
```

Exit code 0 = valid. Exit code 1 = invalid (see error output).

## Integration with standard-version

Commit messages drive automated releases via `standard-version`:

```bash
# After merging conventional commits to main:
npm run release:patch   # from fix: commits
npm run release:minor   # from feat: commits
npm run release:major   # from feat!: or BREAKING CHANGE: commits
```

The generated `CHANGELOG.md` groups entries by type (Features, Bug Fixes, etc.).

## Files Involved

| File | Purpose |
|------|---------|
| `commitlint.config.cjs` | commitlint configuration (types, scopes, length limits) |
| `.husky/pre-commit` | Git hook that runs commitlint on every commit |
| `package.json` (root) | `@commitlint/cli` and `@commitlint/config-conventional` devDependencies |
