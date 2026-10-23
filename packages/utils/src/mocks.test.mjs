import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  discoverMigratedComponents,
  diffElementTrees,
  normalizeElementTree,
  parseHtmlFragment,
  renderModelToRootHtml,
} from "./mockHelpers.mjs";

const COMPONENTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../core/src/components");

test("every migrated component ships the documented file set (html, css, md, model, mock)", () => {
  const components = discoverMigratedComponents(COMPONENTS_DIR);

  assert.ok(components.length >= 7, `expected at least 7 migrated components, found ${components.length}`);

  for (const component of components) {
    const files = [
      `${component.name}.html`,
      `${component.name}.css`,
      `${component.name}.md`,
      `${component.name}-model.mjs`,
      `${component.name}-mock.html`,
    ];

    for (const file of files) {
      assert.ok(fs.existsSync(path.join(component.dir, file)), `${component.name}: missing ${file}`);
    }
  }
});

test("render(model) output matches each component mock golden file", async (t) => {
  const components = discoverMigratedComponents(COMPONENTS_DIR).filter((component) => component.hasMock);

  assert.ok(components.length >= 5, `expected at least 5 model+mock pairs, found ${components.length}`);

  for (const component of components) {
    await t.test(component.name, async () => {
      const { default: model } = await import(pathToFileURL(component.modelPath).href);

      const renderedRoots = parseHtmlFragment(renderModelToRootHtml(model));

      assert.strictEqual(renderedRoots.length, 1, "render(model) must produce exactly one hggs-root node");

      const mockRoots = parseHtmlFragment(fs.readFileSync(component.mockPath, "utf8"));

      assert.strictEqual(
        mockRoots.length,
        1,
        `${component.name}-mock.html must contain exactly one <div id="hggs-root"> block`,
      );

      const differences = diffElementTrees(normalizeElementTree(renderedRoots[0]), normalizeElementTree(mockRoots[0]));

      assert.deepStrictEqual(
        differences,
        [],
        `${component.name}-mock.html is out of date with render(model) output. ` +
          `Run 'npm run mocks:update:utils' to regenerate the mock.\n${differences.join("\n")}`,
      );
    });
  }
});

test("model.cases describes every rendered example (when present)", async (t) => {
  const components = discoverMigratedComponents(COMPONENTS_DIR);

  for (const component of components) {
    await t.test(component.name, async () => {
      const { default: model } = await import(pathToFileURL(component.modelPath).href);

      if (!Array.isArray(model.cases)) {
        return;
      }

      const roots = parseHtmlFragment(renderModelToRootHtml(model));
      const examplesCount = roots[0].children.length;

      assert.strictEqual(
        model.cases.length,
        examplesCount,
        `${component.name}: model.cases has ${model.cases.length} entries but render(model) produces ` +
          `${examplesCount} examples. The markup headers label each example in order, keep them in sync.`,
      );

      for (const [index, label] of model.cases.entries()) {
        assert.strictEqual(typeof label, "string", `${component.name}: cases[${index}] must be a non-empty string`);
        assert.ok(label.trim(), `${component.name}: cases[${index}] must not be blank`);
      }
    });
  }
});
