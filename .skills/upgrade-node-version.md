# Skill: upgrade-node-version

## Description
Upgrade the Node.js runtime to the latest LTS for the Higgsboson project, checking all project files that pin the version and verifying tests still pass after the change.

## Triggers
- User asks to upgrade Node version
- `.nvmrc` is outdated compared to the latest LTS
- CI/test failures related to Node version

## Project files that pin Node version
| File | Purpose |
|------|---------|
| `.nvmrc` | Declares the expected Node version for `nvm` / `nodenv` |
| `package.json` | May contain an `engines.node` field |
| `.github/workflows/*.yml` | May contain `node-version` in job steps |
| `Dockerfile*` | May pin `FROM node:...` |
| `.tool-versions` | asdf version manager pin |

> Note: This project currently only pins Node in `.nvmrc`. There are no GitHub workflows, Dockerfiles, or `engines` fields to update.

---

## Step-by-step instructions

### 1. Check current Node version
```bash
node --version
# Example output: v22.1.0
```

### 2. Check the latest LTS version
```bash
# Query the npm registry for dist-tags
npm view node dist-tags --json

# Or check the official releases page
# https://nodejs.org/en/about/releases/
```

Look for the version with `lts: true` and the highest version number (e.g., `v24.22.1` "Krypton").

### 3. Review project version pins
```bash
cat .nvmrc
# Compare with the latest LTS from step 2
```

Also verify there are no other pins:
```bash
grep -rn "node-version\|engines\|FROM node" .github/ Dockerfile* package.json --include="*.yml" --include="*.yaml" --include="*.json" --include="Dockerfile*" 2>/dev/null | grep -v node_modules || echo "No additional Node version pins found"
```

### 4. Install the new Node version
Choose your version manager:

**nvm** (recommended):
```bash
nvm install 24          # installs latest Node 24 LTS
nvm use 24              # switch to it
nvm alias default 24    # make it the default
```

**n** (tj/n):
```bash
n lts                   # installs latest LTS
```

**Homebrew** (macOS):
```bash
brew upgrade node       # or brew install node@24
```

**Direct download**:
- https://nodejs.org/en/download/

### 5. Update `.nvmrc`
```bash
echo "v24.22.1" > .nvmrc
```

Replace `v24.22.1` with the exact version you installed.

### 6. Upgrade npm to 12+ (required for `npm stage publish/promote`)

Node 24 LTS ships with npm 11.x. The `npm stage publish/promote` commands require npm 12+. Upgrade manually:

```bash
npm install -g npm@12
npm --version  # should print 12.x.x
```

### 7. Verify the installation
```bash
node --version          # should match .nvmrc
npm --version           # should be bundled npm for that Node
cat .nvmrc              # should match node --version output
```

### 7. Reinstall dependencies (clean)
```bash
rm -rf node_modules package-lock.json
npm install
```

### 8. Run the test suite
```bash
npm run test:utils
```

Expected: all tests pass. If any fail, check whether they are pre-existing failures (see `eslint` baseline note below) or introduced by the Node upgrade.

### 9. Run lint (optional sanity check)
```bash
npx eslint -c packages/utils/eslint.config.mjs 2>&1 | tail -5
```

> Note: This project has pre-existing ESLint errors (CJS `require`/`module`/`process`/`console` no-undef in legacy config files). These are not introduced by the Node upgrade.

---

## Verification checklist

- [ ] `node --version` output matches `.nvmrc` exactly
- [ ] `npm install` completes without errors
- [ ] `npm run test:utils` passes (all tests green)
- [ ] No new ESLint errors introduced beyond the pre-existing baseline
- [ ] `.nvmrc` committed if changing the project pin

---

## Rollback

If the upgrade causes issues:

```bash
# with nvm
nvm use 22              # switch back to previous version
nvm alias default 22

# restore .nvmrc
git checkout -- .nvmrc
```

---

## Example: upgrading from v22.1.0 to v24.22.1

```bash
# 1. Check current
node --version          # v22.1.0

# 2. Check latest LTS
npm view node dist-tags --json
# -> {"v24-lts": "24.22.1", ...}

# 3. Install
nvm install 24
nvm use 24

# 4. Update project pin
echo "v24.22.1" > .nvmrc

# 5. Reinstall deps
rm -rf node_modules package-lock.json
npm install

# 6. Verify
npm run test:utils      # 107 pass / 0 fail
```

---

## Maintenance

Re-run this skill periodically (e.g., quarterly) to check whether a newer Node LTS is available:

```bash
npm view node dist-tags.lts
# Compare with .nvmrc
```
