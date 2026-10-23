/**
 * Table model.
 *
 * Renderer note: a classless node with a single label is only pushed once per `getDescriptions`
 * call, so sibling `<tr>` elements would collapse into the first row (and pile their cells into
 * it). To keep five structurally identical rows with DIFFERENT cell content, the rows are chained
 * in the model (`tr1.next = [tr2, ...cells]`, `tr2.next = [tr3, ...cells]`, ...) so every row is
 * expanded in its own call, and rows 2-5 override `prev` with the tbody description id so they
 * still append under `<tbody>` in the DOM. The chain nodes never leak into `tbody.next`.
 */

// Exact generated description id of <tbody> (root edge-0 > wrapper > table > tbody).
const TBODY_ID =
  "edge-0 --> tag-div --> class-hggs-table-wrapper-0 --> tag-table --> class-hggs-table-0 --> tag-tbody --> class-hggs-table-body-0";

const HEAD_CELL = "hggs-table-cell--head";
const CAPITALIZE_CELL = "hggs-table-cell--head hggs-table-cell--capitalize";
const BODY_CELL = "hggs-table-cell";

const HEADERS = [
  { label: "Name" },
  { label: "id", isCapitalized: true },
  { label: "Country" },
  { label: "Phase" },
  { label: "Days Left" },
  { label: "Progress" },
  { label: "Due Date" },
];

const STATE_CLASSES = {
  preparation: "hggs-tag hggs-tag--primary hggs-tag--subtle hggs-tag--small",
  pending: "hggs-tag hggs-tag--tertiary hggs-tag--subtle hggs-tag--small",
  complete: "hggs-tag hggs-tag--senary hggs-tag--subtle hggs-tag--small",
};

const ROWS = [
  [
    { label: "GRIF_114_0 VAL CS11720" },
    { label: "124536845130" },
    { label: "usa" },
    { label: "Preparation", state: "preparation" },
    { label: "10" },
    { label: "20%" },
    { label: "01.12.2021" },
  ],
  [
    { label: "GRIF_114_0 VAL CS11721" },
    { label: "124536845131" },
    { label: "Germany" },
    { label: "Pending", state: "pending" },
    { label: "2" },
    { label: "80%" },
    { label: "02.12.2021" },
  ],
  [
    { label: "GRIF_114_0 VAL CS11722" },
    { label: "124536845132" },
    { label: "Spain" },
    { label: "Complete", state: "complete" },
    { label: "4" },
    { label: "60%" },
    { label: "03.12.2021" },
  ],
  [
    { label: "GRIF_114_0 VAL CS11723" },
    { label: "124536845133" },
    { label: "usa" },
    { label: "Complete", state: "complete" },
    { label: "0" },
    { label: "30%" },
    { label: "04.12.2021" },
  ],
  [
    { label: "GRIF_114_0 VAL CS11724" },
    { label: "124536845134" },
    { label: "Spain" },
    { label: "Pending", state: "pending" },
    { label: "8" },
    { label: "20%" },
    { label: "05.12.2021" },
  ],
];

/** One <td>: state cells wrap their label in the state tag div (legacy renders the tag classes,
 * the template's bold/capitalize cellClass is dead code — every body cell keeps the base class). */
const cellNode = (cell) => ({
  tag: "td",
  classNames: [BODY_CELL],
  labels: cell.state ? null : [cell.label],
  next: cell.state
    ? [
        {
          tag: "div",
          classNames: [STATE_CLASSES[cell.state]],
          labels: [cell.label],
          next: null,
        },
      ]
    : null,
});

/** Build the chained rows: each row points at the next row first so it expands in its own call. */
const rowNodes = ROWS.map((row, index) => ({
  tag: "tr",
  classNames: null,
  labels: [""],
  ...(index > 0 ? { prev: TBODY_ID } : {}),
  next: null,
}));

for (let index = 0; index < rowNodes.length - 1; index++) {
  rowNodes[index].next = [rowNodes[index + 1], ...ROWS[index].map(cellNode)];
}

rowNodes[rowNodes.length - 1].next = ROWS[ROWS.length - 1].map(cellNode);

const tableModel = {
  title: "Table",
  cases: ["Table"],
  nodes: [
    {
      tag: "div",
      classNames: ["hggs-table-wrapper"],
      labels: null,
      next: [
        {
          tag: "table",
          classNames: ["hggs-table"],
          labels: null,
          next: [
            {
              tag: "thead",
              classNames: ["hggs-table-head"],
              labels: null,
              next: [
                {
                  tag: "tr",
                  classNames: null,
                  labels: [""],
                  next: HEADERS.map((header) => ({
                    tag: "th",
                    classNames: [header.isCapitalized ? CAPITALIZE_CELL : HEAD_CELL],
                    labels: [header.label],
                    next: null,
                  })),
                },
              ],
            },
            {
              tag: "tbody",
              classNames: ["hggs-table-body"],
              labels: null,
              next: [rowNodes[0]],
            },
          ],
        },
      ],
    },
  ],
};

export default tableModel;
