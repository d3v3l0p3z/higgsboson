import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

import avatarModel from "../../core/src/components/avatar/avatar-model.mjs";
import boxModel from "../../core/src/components/box/box-model.mjs";
import checkboxModel from "../../core/src/components/checkbox/checkbox-model.mjs";
import dividerModel from "../../core/src/components/divider/divider-model.mjs";
import listModel from "../../core/src/components/list/list-model.mjs";

import addMarkupHeaders, { getCaseLabels } from "./addMarkupHeaders.mjs";
import render from "./render.mjs";

/**
 * Create a JSDOM document with the given root html content.
 * @param {string} rootHtml - The inner html of the root node.
 * @returns {Document} The JSDOM document.
 */
function createDocument(rootHtml) {
  return new JSDOM(`<body><div id="hggs-root">${rootHtml}</div></body>`).window.document;
}

test("addMarkupHeaders inserts the page title and a case heading per example", () => {
  const document = createDocument("");

  globalThis.document = document;

  render(dividerModel);
  addMarkupHeaders(dividerModel);

  const rootNode = document.getElementById("hggs-root");
  const [pageTitle, heading, example] = rootNode.children;

  assert.equal(rootNode.children.length, 3);
  assert.equal(pageTitle.tagName, "H1");
  assert.ok(pageTitle.classList.contains("hggs-h1"));
  assert.equal(pageTitle.textContent, "Divider");
  assert.equal(heading.tagName, "H2");
  assert.ok(heading.classList.contains("hggs-h2"));
  assert.equal(heading.textContent, "Divider");
  assert.equal(pageTitle.nextElementSibling, heading);
  assert.equal(heading.nextElementSibling, example);
  assert.equal(example.tagName, "DIV");
  assert.equal(rootNode.querySelector("pre"), null, "no markup code preview is rendered");

  delete globalThis.document;
});

test("addMarkupHeaders derives case labels from the root modifiers when the model has no cases", () => {
  const document = createDocument("");

  globalThis.document = document;

  render(avatarModel);
  addMarkupHeaders(avatarModel);

  const headings = [...document.querySelectorAll("#hggs-root > h2")].map((h2) => h2.textContent);

  assert.deepEqual(headings, ["Avatar", "Avatar big", "Avatar small"]);

  delete globalThis.document;
});

test("addMarkupHeaders uses the model explicit cases for every example", () => {
  const document = createDocument("");

  globalThis.document = document;

  render(boxModel);
  addMarkupHeaders(boxModel);

  const headings = [...document.querySelectorAll("#hggs-root > h2")].map((h2) => h2.textContent);

  assert.deepEqual(headings, boxModel.cases);
  assert.equal(headings.length, 8);

  delete globalThis.document;
});

test("addMarkupHeaders applies explicit cases per example (checkbox and list)", () => {
  const document = createDocument("");

  globalThis.document = document;

  render(checkboxModel);
  addMarkupHeaders(checkboxModel);

  const checkboxHeadings = [...document.querySelectorAll("#hggs-root > h2")].map((h2) => h2.textContent);

  assert.deepEqual(checkboxHeadings, ["Checkbox", "Checkbox group"]);

  const listDocument = createDocument("");

  globalThis.document = listDocument;

  render(listModel);
  addMarkupHeaders(listModel);

  const listHeadings = [...listDocument.querySelectorAll("#hggs-root > h2")].map((h2) => h2.textContent);

  assert.deepEqual(listHeadings, ["List", "List with markers"]);

  delete globalThis.document;
});

test("getCaseLabels falls back to derived labels when the cases length does not match", () => {
  const document = createDocument("");

  globalThis.document = document;

  render(dividerModel);

  const examples = [...document.getElementById("hggs-root").children];
  const labels = getCaseLabels({ title: "Thing", cases: ["one", "two"] }, examples);

  assert.deepEqual(labels, ["Thing"]);

  delete globalThis.document;
});

test("addMarkupHeaders interleaves the page title, headings and examples in order", () => {
  const document = createDocument("");

  globalThis.document = document;

  render(dividerModel);
  render(listModel);

  const rootNode = document.getElementById("hggs-root");
  const exampleTags = [...rootNode.children].map((child) => child.tagName);

  addMarkupHeaders({ ...dividerModel, title: "Mixed", cases: ["A", "B", "C"] });

  const tags = [...rootNode.children].map((child) => child.tagName);

  assert.deepEqual(tags, ["H1", ...exampleTags.flatMap((tag) => ["H2", tag])]);

  delete globalThis.document;
});

test("addMarkupHeaders rebuilds its decorations instead of duplicating them", () => {
  const document = createDocument("");

  globalThis.document = document;

  render(boxModel);
  addMarkupHeaders(boxModel);

  const lengthAfterFirstRun = document.getElementById("hggs-root").children.length;

  addMarkupHeaders(boxModel);

  const rootNode = document.getElementById("hggs-root");

  assert.equal(rootNode.children.length, lengthAfterFirstRun);
  assert.equal(rootNode.querySelectorAll(":scope > h1").length, 1);
  assert.equal(rootNode.querySelectorAll(":scope > h2").length, 8);
  assert.equal(rootNode.querySelectorAll(":scope > pre").length, 0);

  delete globalThis.document;
});

test("addMarkupHeaders does not throw when the root node is missing", () => {
  const document = createDocument("");

  globalThis.document = document;

  assert.doesNotThrow(() => addMarkupHeaders(dividerModel));

  delete globalThis.document;
});

test("addMarkupHeaders still accepts a root node id as first argument", () => {
  const document = createDocument("");

  globalThis.document = document;

  render(dividerModel);
  addMarkupHeaders("hggs-root");

  const rootNode = document.getElementById("hggs-root");

  assert.equal(rootNode.querySelector("h1"), null);
  assert.equal(rootNode.querySelector("h2"), null);
  assert.equal(rootNode.querySelector("pre"), null);
  assert.equal(rootNode.children.length, 1);

  delete globalThis.document;
});
