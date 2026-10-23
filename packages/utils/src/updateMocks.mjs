/**
 * Regenerate the `*-mock.html` golden files from each migrated component model.
 *
 * The render(model) output is the source of truth: this script renders every component
 * that already uses the new renderer, formats the result with prettier and writes it to
 * `<name>-mock.html`. Components without a mock get one created.
 *
 * Usage:
 *   node src/updateMocks.mjs               # update every migrated component
 *   node src/updateMocks.mjs box list      # update only the given components
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import prettier from "prettier";

import { discoverMigratedComponents, renderModelToRootHtml } from "./mockHelpers.mjs";

const COMPONENTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../core/src/components");

const PRETTIER_OPTIONS = {
  parser: "html",
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: "none",
};

/**
 * Render one component model and write its mock file when it changed.
 * @param {{name: string, modelPath: string, mockPath: string}} component - The component to update.
 * @returns {Promise<"created" | "updated" | "unchanged">} The action performed.
 */
async function updateMock(component) {
  const { default: model } = await import(pathToFileURL(component.modelPath).href);

  const renderedHtml = renderModelToRootHtml(model);
  const formattedHtml = await prettier.format(renderedHtml, PRETTIER_OPTIONS);
  const nextHtml = formattedHtml.endsWith("\n") ? formattedHtml : `${formattedHtml}\n`;
  const previousHtml = fs.existsSync(component.mockPath) ? fs.readFileSync(component.mockPath, "utf8") : null;

  if (previousHtml === nextHtml) {
    return "unchanged";
  }

  fs.writeFileSync(component.mockPath, nextHtml);

  return previousHtml === null ? "created" : "updated";
}

const requestedNames = process.argv.slice(2);
let components = discoverMigratedComponents(COMPONENTS_DIR);

if (requestedNames.length > 0) {
  const unknownNames = requestedNames.filter((name) => !components.some((component) => component.name === name));

  if (unknownNames.length > 0) {
    console.error(`Unknown or not yet migrated components: ${unknownNames.join(", ")}`);

    process.exit(1);
  }

  components = components.filter((component) => requestedNames.includes(component.name));
}

if (components.length === 0) {
  console.error(`No migrated components found in ${COMPONENTS_DIR}`);

  process.exit(1);
}

for (const component of components) {
  const action = await updateMock(component);

  console.log(`${action}: ${component.name}-mock.html`);
}
