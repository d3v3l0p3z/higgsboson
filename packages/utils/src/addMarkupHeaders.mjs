const LOGS_WARNINGS_ACTIVE = typeof process !== "undefined" && process.env?.LOGS_WARNINGS_ACTIVE === "true";

/** Marker class on every element this module manages, so repeated calls can rebuild them. */
const MARKUP_HEADER_CLASS = "hggs-markup-header";

/**
 * Get the modifiers (e.g. `primary`, `rounded`) declared on the root element of an example.
 * Only the root element is inspected: nested `--` classes belong to child components
 * (a dialog with a `hggs-button--primary` inside is not a "Dialog primary" case).
 * @param {Element} example - The rendered example.
 * @returns {string[]} The modifiers in class order, without duplicates.
 */
function getRootModifiers(example) {
  const classNames = (example.getAttribute("class") || "").split(/\s+/).filter(Boolean);
  const modifiers = [];

  for (const className of classNames) {
    const separatorIndex = className.indexOf("--");

    if (separatorIndex === -1) {
      continue;
    }

    const modifier = className.slice(separatorIndex + 2);

    if (modifier && !modifiers.includes(modifier)) {
      modifiers.push(modifier);
    }
  }

  return modifiers;
}

/**
 * Compose the h2 label for each rendered example.
 * Uses the model `cases` array when it has exactly one entry per example (explicit wins as-is);
 * otherwise falls back to `model.title` plus the modifiers on the example's root element.
 * @param {object|undefined} model - The component model.
 * @param {Element[]} examples - The rendered examples, in render order.
 * @returns {string[]} The label per example (may be empty when there is nothing to describe).
 */
export function getCaseLabels(model, examples) {
  const title = typeof model?.title === "string" ? model.title.trim() : "";
  const cases = Array.isArray(model?.cases) ? model.cases : null;
  const hasExplicitCases = cases !== null && cases.length === examples.length;

  if (cases !== null && !hasExplicitCases && LOGS_WARNINGS_ACTIVE) {
    console.warn(
      `Model cases length (${cases.length}) does not match the rendered examples (${examples.length}); falling back to derived labels`,
    );
  }

  return examples.map((example, index) => {
    const explicit = hasExplicitCases ? cases[index] : null;

    if (typeof explicit === "string" && explicit.trim()) {
      return explicit.trim();
    }

    return [title, ...getRootModifiers(example)].filter(Boolean).join(" ");
  });
}

/**
 * Decorate the examples rendered into the root node with page headings:
 * an `hggs-h1` page title from `model.title` on top, and before each example a case `hggs-h2`
 * (explicit `model.cases` entry or title plus root modifiers).
 * All headings carry the `hggs-markup-header` marker class, so repeated calls rebuild them
 * instead of duplicating them.
 * @param {object|string} [model] - The component model (or the root node id, when called the old way).
 * @param {string} [rootNodeId] - The root node id.
 * @returns {void}
 */
export default function addMarkupHeaders(model, rootNodeId = "hggs-root") {
  if (typeof model === "string") {
    rootNodeId = model;
    model = undefined;
  }

  const rootNode = document.getElementById(rootNodeId);

  if (!rootNode) {
    if (LOGS_WARNINGS_ACTIVE) {
      console.warn(`No root node found with id ${rootNodeId}, skipping markup headers`);
    }

    return;
  }

  for (const child of [...rootNode.children]) {
    if (child.classList.contains(MARKUP_HEADER_CLASS)) {
      child.remove();
    }
  }

  const examples = [...rootNode.children];
  const labels = getCaseLabels(model, examples);

  examples.forEach((example, index) => {
    const label = labels[index];

    if (label) {
      const heading = document.createElement("h2");

      heading.classList.add("hggs-h2", MARKUP_HEADER_CLASS);
      heading.textContent = label;

      rootNode.insertBefore(heading, example);
    }
  });

  const title = typeof model?.title === "string" ? model.title.trim() : "";

  if (title) {
    const pageTitle = document.createElement("h1");

    pageTitle.classList.add("hggs-h1", MARKUP_HEADER_CLASS);
    pageTitle.textContent = title;

    rootNode.prepend(pageTitle);
  }
}
