import fs from "node:fs";
import path from "node:path";

import { JSDOM } from "jsdom";

import render from "./render.mjs";

/** Root node id used by component pages and mock golden files. */
export const HGGS_ROOT_ID = "hggs-root";

/** Matches html files importing the new renderer (and not renderComponentDeprecated). */
const NEW_RENDERER_IMPORT = /from\s+["'][^"']*\/render\.mjs["']/;

/**
 * Discover migrated components: directories with `<name>.html` importing the new renderer
 * and a `<name>-model.mjs` data model.
 * @param {string} componentsDir - Absolute path to packages/core/src/components.
 * @returns {{name: string, dir: string, htmlPath: string, modelPath: string, mockPath: string, hasMock: boolean}[]} The migrated components.
 */
export function discoverMigratedComponents(componentsDir) {
  const components = [];

  for (const entry of fs.readdirSync(componentsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const dir = path.join(componentsDir, entry.name);
    const htmlPath = path.join(dir, `${entry.name}.html`);
    const modelPath = path.join(dir, `${entry.name}-model.mjs`);

    if (!fs.existsSync(htmlPath) || !fs.existsSync(modelPath)) {
      continue;
    }

    if (!NEW_RENDERER_IMPORT.test(fs.readFileSync(htmlPath, "utf8"))) {
      continue;
    }

    const mockPath = path.join(dir, `${entry.name}-mock.html`);

    components.push({
      name: entry.name,
      dir,
      htmlPath,
      modelPath,
      mockPath,
      hasMock: fs.existsSync(mockPath),
    });
  }

  return components.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Render a component model into a fresh DOM and return the root element outer HTML.
 * @param {object} model - The component model.
 * @param {string} [rootNodeId] - The root node id.
 * @returns {string} The root element outer HTML.
 */
export function renderModelToRootHtml(model, rootNodeId = HGGS_ROOT_ID) {
  const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="${rootNodeId}"></div></body></html>`, {
    url: "http://localhost",
  });
  const previousDocument = globalThis.document;

  globalThis.document = dom.window.document;

  try {
    render(model, rootNodeId);
  } finally {
    globalThis.document = previousDocument;
  }

  const rootNode = dom.window.document.getElementById(rootNodeId);

  if (!rootNode) {
    throw new Error(`No root node with id ${rootNodeId} after rendering the model`);
  }

  return rootNode.outerHTML;
}

/**
 * Parse an html fragment and return every root node (`[id="hggs-root"]`).
 * @param {string} html - The html fragment.
 * @returns {Element[]} The root nodes found.
 */
export function parseHtmlFragment(html) {
  const dom = new JSDOM(`<!DOCTYPE html><html><body>${html}</body></html>`);

  return [...dom.window.document.querySelectorAll(`[id="${HGGS_ROOT_ID}"]`)];
}

/**
 * Normalize an element into a plain tree so pretty-printed mocks compare equal to render output:
 * - tag names lowercased,
 * - attributes as a key-sorted object,
 * - text collapsed to single spaces (mocks are prettier-wrapped, render output is not).
 * @param {Element} element - The element to normalize.
 * @returns {{tag: string, attributes: Record<string, string>, text: string, children: object[]}} The normalized tree.
 */
export function normalizeElementTree(element) {
  const attributes = {};

  for (const attribute of element.attributes) {
    attributes[attribute.name] = attribute.value;
  }

  const text = [...element.childNodes]
    .filter((node) => node.nodeType === 3)
    .map((node) => node.textContent)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    tag: element.tagName.toLowerCase(),
    attributes: Object.fromEntries(Object.entries(attributes).sort(([a], [b]) => a.localeCompare(b))),
    text,
    children: [...element.children].map(normalizeElementTree),
  };
}

/**
 * Deep-diff two normalized element trees.
 * @param {object} rendered - The tree built from render(model) output.
 * @param {object} expected - The tree built from the mock golden file.
 * @param {string} [location] - The current location label (for readable messages).
 * @returns {string[]} The differences found (empty when both trees are equal).
 */
export function diffElementTrees(rendered, expected, location = "root") {
  const differences = [];

  if (rendered.tag !== expected.tag) {
    differences.push(`${location}: tag <${rendered.tag}> (render) vs <${expected.tag}> (mock)`);

    return differences;
  }

  const names = [...new Set([...Object.keys(rendered.attributes), ...Object.keys(expected.attributes)])].sort();

  for (const name of names) {
    const renderedValue = rendered.attributes[name];
    const expectedValue = expected.attributes[name];

    if (renderedValue !== expectedValue) {
      differences.push(
        `${location} <${rendered.tag}> attribute "${name}": render=${JSON.stringify(renderedValue)} mock=${JSON.stringify(expectedValue)}`,
      );
    }
  }

  if (rendered.text !== expected.text) {
    differences.push(
      `${location} <${rendered.tag}> text: render=${JSON.stringify(rendered.text.slice(0, 120))} mock=${JSON.stringify(expected.text.slice(0, 120))}`,
    );
  }

  if (rendered.children.length !== expected.children.length) {
    const describe = (children) => `[${children.map((child) => child.tag).join(", ")}]`;

    differences.push(
      `${location} <${rendered.tag}> child count: render=${rendered.children.length} ${describe(rendered.children)} mock=${expected.children.length} ${describe(expected.children)}`,
    );
  }

  const count = Math.min(rendered.children.length, expected.children.length);

  for (let i = 0; i < count; i++) {
    differences.push(
      ...diffElementTrees(
        rendered.children[i],
        expected.children[i],
        `${location} > ${rendered.children[i].tag}[${i}]`,
      ),
    );
  }

  return differences;
}
