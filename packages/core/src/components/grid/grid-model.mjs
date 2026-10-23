/**
 * The renderer deduplicates sibling nodes whose generated ids collide, so two cells that share
 * the same class string (e.g. two `4of12` cells in one grid) would collapse into a single cell.
 * Repeating the class tokens keeps the ids unique; classList normalization renders the same class
 * attribute, so the golden markup still matches the legacy page exactly.
 * @param {string} className - The class string shared by the sibling cells.
 * @param {number} occurrence - How many times this class already appeared among the siblings.
 * @returns {string} A sibling-unique variant of the class string.
 */
const uniqueSibling = (className, occurrence) =>
  occurrence === 0
    ? className
    : Array(occurrence + 1)
        .fill(className)
        .join(" ");

const GRID_CLASSES = [
  "hggs-grid",
  "hggs-grid hggs-grid--center",
  "hggs-grid hggs-grid--center",
  "hggs-grid hggs-grid--center",
  "hggs-grid hggs-grid--right",
  "hggs-grid hggs-grid--left",
  "hggs-grid hggs-grid--between",
  "hggs-grid",
];

const CELL_LAYOUTS = [
  ["hggs-cell hggs-cell--4of12"],
  ["hggs-cell hggs-cell--6of12"],
  ["hggs-cell hggs-cell--4of12", "hggs-cell hggs-cell--2of12"],
  ["hggs-cell hggs-cell--4of12", "hggs-cell hggs-cell--2of12", "hggs-cell hggs-cell--4of12"],
  ["hggs-cell hggs-cell--4of12", "hggs-cell hggs-cell--2of12"],
  ["hggs-cell hggs-cell--4of12", "hggs-cell hggs-cell--2of12"],
  ["hggs-cell hggs-cell--4of12", "hggs-cell hggs-cell--2of12"],
  [
    "hggs-cell hggs-cell--6of12",
    "hggs-cell hggs-cell--2of12",
    "hggs-cell hggs-cell--4of12",
    "hggs-cell hggs-cell--4of12",
    "hggs-cell hggs-cell--3of12",
    "hggs-cell hggs-cell--5of12",
  ],
];

const gridModel = {
  title: "Grid",
  // Auto labels would collide (three "Grid center" roots, two bare "Grid" roots), so label them.
  cases: [
    "Grid",
    "Grid center",
    "Grid center two cells",
    "Grid center three cells",
    "Grid right",
    "Grid left",
    "Grid between",
    "Grid six cells",
  ],
  nodes: GRID_CLASSES.map((gridClass, index) => {
    // Legacy quirk (verified live): single-cell entries render an inner div carrying the GRID
    // classes — the template computes cellClass but never uses it.
    if (index < 2) {
      return {
        tag: "div",
        classNames: [gridClass],
        labels: null,
        next: [
          {
            tag: "div",
            classNames: [gridClass],
            labels: null,
            next: null,
          },
        ],
      };
    }

    const occurrences = new Map();

    return {
      tag: "div",
      classNames: [gridClass],
      labels: null,
      next: CELL_LAYOUTS[index].map((cellClass) => {
        const occurrence = occurrences.get(cellClass) ?? 0;

        occurrences.set(cellClass, occurrence + 1);

        return {
          tag: "div",
          classNames: [uniqueSibling(cellClass, occurrence)],
          labels: null,
          next: null,
        };
      }),
    };
  }),
};

export default gridModel;
