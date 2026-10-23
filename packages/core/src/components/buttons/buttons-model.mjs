/**
 * The renderer deduplicates sibling nodes whose generated ids collide, so identical class
 * strings would collapse e.g. the ten icon buttons of a row into a single button. Repeating a
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

const COLORS = ["primary", "secondary", "tertiary", "quaternary", "quinary", "senary"];

/** Plain button modifier combos: base, full width, sizes, outline, then each color family. */
const DEFAULT_MODIFIERS = [
  [],
  ["full-width"],
  ["big"],
  ["medium"],
  ["small"],
  ["outline"],
  ["outline", "big"],
  ["outline", "medium"],
  ["outline", "small"],
  ...COLORS.flatMap((color) => [
    [color],
    [color, "big"],
    [color, "medium"],
    [color, "small"],
    [color, "outline"],
    [color, "outline", "medium"],
    [color, "outline", "small"],
  ]),
];

/** Color variants for the icon button sections (base entry plus one per color). */
const COLOR_SECTIONS = [null, ...COLORS];

/** Square/circle icon button families: base, each color, outline, outline plus each color. */
const SHAPE_MODIFIERS = [[], ...COLORS.map((color) => [color]), ["outline"], ...COLORS.map((color) => ["outline", color])];

const ICON_SIZES = ["hggs-icon--big", "hggs-icon--small", "hggs-icon--micro"];

const modifierClassNames = (modifiers, prefix) => modifiers.map((modifier) => `${prefix}--${modifier}`);

/** One plain button example per modifier combo (51 examples, legacy `default` section). */
const defaultNodes = DEFAULT_MODIFIERS.map((modifiers) => ({
  tag: "button",
  classNames: [["hggs-button", ...modifierClassNames(modifiers, "hggs-button")].join(" ")],
  labels: ["Button"],
  next: null,
}));

/** One row of ten icon buttons per color section (legacy `icons` section, 7 rows). */
const iconRowNodes = COLOR_SECTIONS.map(() => ({
  tag: "div",
  classNames: ["hggs-flex hggs-flex--row-top-left"],
  labels: null,
  next: ICON_TYPES.map((iconClass, index) => ({
    tag: "button",
    classNames: [uniqueSibling("hggs-button", index)],
    labels: null,
    next: [
      {
        tag: "span",
        classNames: [iconClass],
        labels: null,
        next: null,
      },
    ],
  })),
}));

/** One row of ten labeled icon buttons per color section (legacy `iconsWithLabel` section). */
const iconWithLabelRowNodes = COLOR_SECTIONS.map(() => ({
  tag: "div",
  classNames: ["hggs-flex hggs-flex--row-top-left"],
  labels: null,
  next: ICON_TYPES.map((iconClass, index) => ({
    tag: "button",
    classNames: [uniqueSibling("hggs-button", index)],
    labels: null,
    next: [
      {
        tag: "div",
        classNames: ["hggs-icon-wrapper"],
        labels: null,
        next: [
          {
            tag: "span",
            classNames: [iconClass],
            labels: null,
            next: null,
          },
          {
            tag: "span",
            classNames: ["hggs-icon-label"],
            labels: [" Button label"],
            next: null,
          },
        ],
      },
    ],
  })),
}));

/** One column of three size rows per shape and color family (legacy `squareIcons`/`circleIcons`). */
const shapeColumnNodes = ["square", "circle"].flatMap((shape) =>
  SHAPE_MODIFIERS.map((modifiers) => ({
    tag: "div",
    classNames: ["hggs-flex hggs-flex--column-top-left"],
    labels: null,
    next: ICON_SIZES.map((size, rowIndex) => ({
      tag: "div",
      classNames: [uniqueSibling("hggs-flex hggs-flex--row-top-left", rowIndex)],
      labels: null,
      next: ICON_TYPES.map((iconClass, index) => ({
        tag: "button",
        classNames: [
          uniqueSibling(
            [
              "hggs-button",
              "hggs-icon-wrapper",
              `hggs-icon--${shape}`,
              ...modifierClassNames(modifiers, "hggs-icon"),
              size,
            ].join(" "),
            index,
          ),
        ],
        labels: null,
        next: [
          {
            tag: "span",
            classNames: [iconClass],
            labels: null,
            next: null,
          },
        ],
      })),
    })),
  })),
);

const sectionLabel = (prefix, color) => `${prefix}${color ? ` ${color}` : ""}`;

const buttonsModel = {
  title: "Buttons",
  cases: [
    ...DEFAULT_MODIFIERS.map((modifiers) => ["Buttons", ...modifiers].join(" ")),
    ...COLOR_SECTIONS.map((color) => sectionLabel("Icon buttons", color)),
    ...COLOR_SECTIONS.map((color) => sectionLabel("Icon buttons with label", color)),
    ...["square", "circle"].flatMap((shape) =>
      SHAPE_MODIFIERS.map((modifiers) =>
        sectionLabel(`${shape[0].toUpperCase()}${shape.slice(1)} icon buttons`, modifiers.join(" ") || null),
      ),
    ),
  ],
  nodes: [...defaultNodes, ...iconRowNodes, ...iconWithLabelRowNodes, ...shapeColumnNodes],
};

export default buttonsModel;
