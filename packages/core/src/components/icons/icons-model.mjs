/**
 * The renderer deduplicates sibling nodes whose generated ids collide, so identical class
 * strings would collapse e.g. the three size rows of a column into a single row. Repeating a
 * class token in the model string keeps the ids unique; classList normalization renders the
 * same class attribute, so the golden markup still matches the legacy page exactly.
 * @param {string} className - The class string shared by the siblings.
 * @param {number} index - The sibling index (0 based).
 * @returns {string} A sibling-unique variant of the class string.
 */
const uniqueSibling = (className, index) =>
  index === 0 ? className : Array(index + 1).fill(className).join(" ");

const ICON_TYPES = [
  "hggs-icon hggs-icon--edit",
  "hggs-icon hggs-icon--hamburger-menu",
  "hggs-icon hggs-icon--log-out",
  "hggs-icon hggs-icon--question",
  "hggs-icon hggs-icon--user",
  "hggs-icon hggs-icon--close",
  "hggs-icon hggs-icon--plus",
  "hggs-icon hggs-icon--chevron-down",
  "hggs-icon hggs-icon--check",
  "hggs-icon hggs-icon--pending",
];

const ICON_SIZES = ["", "hggs-icon--small", "hggs-icon--micro"];

const COLORS = ["primary", "secondary", "tertiary", "quaternary", "quinary", "senary"];

/** Default/labeled color sections: base entry plus one per color. */
const COLOR_SECTIONS = [null, ...COLORS];

/** Shape families: base, each color, outline, outline plus each color (14 per shape). */
const SHAPE_MODIFIERS = [[], ...COLORS.map((color) => [color]), ["outline"], ...COLORS.map((color) => ["outline", color])];

const COLUMN_CLASS = "hggs-flex hggs-flex--column-top-left hggs-flex--gap-small";
const ROW_CLASS = "hggs-flex hggs-flex--row-top-left hggs-flex--gap-small";

const iconClass = (type, modifier, size) => [type, modifier, size].filter(Boolean).join(" ");

const sectionLabel = (prefix, suffix) => (suffix ? `${prefix} ${suffix}` : prefix);

const columnNode = (rows) => ({
  tag: "div",
  classNames: [COLUMN_CLASS],
  labels: null,
  next: rows,
});

/** Three size rows of plain icon spans (legacy `default` section). */
const defaultRows = (modifier) =>
  ICON_SIZES.map((size, rowIndex) => ({
    tag: "div",
    classNames: [uniqueSibling(ROW_CLASS, rowIndex)],
    labels: null,
    next: ICON_TYPES.map((type) => ({
      tag: "span",
      classNames: [iconClass(type, modifier, size)],
      labels: null,
      next: null,
    })),
  }));

/** Three size rows of labeled wrappers; the size applies to the icon span (legacy `labeled`). */
const labeledRows = (modifier) =>
  ICON_SIZES.map((size, rowIndex) => ({
    tag: "div",
    classNames: [uniqueSibling(ROW_CLASS, rowIndex)],
    labels: null,
    next: ICON_TYPES.map((type, index) => ({
      tag: "div",
      classNames: [uniqueSibling("hggs-icon-wrapper", index)],
      labels: null,
      next: [
        {
          tag: "span",
          classNames: [iconClass(type, modifier, size)],
          labels: null,
          next: null,
        },
        {
          tag: "span",
          classNames: ["hggs-icon-label"],
          labels: ["Button labeled"],
          next: null,
        },
      ],
    })),
  }));

/** Three size rows of shape wrappers; the size applies to the wrapper (legacy `shapes`). */
const shapeRows = (wrapperBase) =>
  ICON_SIZES.map((size, rowIndex) => ({
    tag: "div",
    classNames: [uniqueSibling(ROW_CLASS, rowIndex)],
    labels: null,
    next: ICON_TYPES.map((type, index) => ({
      tag: "div",
      classNames: [uniqueSibling([wrapperBase, size].filter(Boolean).join(" "), index)],
      labels: null,
      next: [
        {
          tag: "span",
          classNames: [type],
          labels: null,
          next: null,
        },
      ],
    })),
  }));

const shapeNodes = ["circle", "square"].flatMap((shape) =>
  SHAPE_MODIFIERS.map((modifiers) =>
    columnNode(
      shapeRows(
        ["hggs-icon-wrapper", `hggs-icon--${shape}`, ...modifiers.map((modifier) => `hggs-icon--${modifier}`)].join(
          " ",
        ),
      ),
    ),
  ),
);

const iconsModel = {
  title: "Icons",
  cases: [
    ...COLOR_SECTIONS.map((color) => sectionLabel("Icons", color)),
    ...COLOR_SECTIONS.map((color) => sectionLabel("Labeled icons", color)),
    ...["circle", "square"].flatMap((shape) =>
      SHAPE_MODIFIERS.map((modifiers) =>
        sectionLabel(
          `${shape[0].toUpperCase()}${shape.slice(1)} icons`,
          modifiers.join(" ") || null,
        ),
      ),
    ),
  ],
  nodes: [
    ...COLOR_SECTIONS.map((modifier) => columnNode(defaultRows(modifier))),
    ...COLOR_SECTIONS.map((modifier) => columnNode(labeledRows(modifier))),
    ...shapeNodes,
  ],
};

export default iconsModel;
