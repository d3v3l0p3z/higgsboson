const FLEX_CLASSES = [
  ["hggs-flex", "hggs-flex--column-center", "hggs-flex--gap-small"],
  ["hggs-flex", "hggs-flex--column-top-center", "hggs-flex--gap-small"],
  ["hggs-flex", "hggs-flex--column-top-left", "hggs-flex--gap-small"],
  ["hggs-flex", "hggs-flex--column-top-right", "hggs-flex--gap-small"],
  ["hggs-flex", "hggs-flex--row-center", "hggs-flex--gap-small"],
  ["hggs-flex", "hggs-flex--row-top-center", "hggs-flex--gap-small"],
  ["hggs-flex", "hggs-flex--row-left-center", "hggs-flex--gap-small"],
  ["hggs-flex", "hggs-flex--row-right-center", "hggs-flex--gap-small"],
  ["hggs-flex", "hggs-flex--row-left-stretch", "hggs-flex--gap-small"],
  ["hggs-flex", "hggs-flex--row-top-left", "hggs-flex--gap-small"],
  ["hggs-flex", "hggs-flex--row-space-between-center", "hggs-flex--gap-small"],
];

const flexModel = {
  title: "Flex",
  nodes: FLEX_CLASSES.map((classes) => ({
    tag: "div",
    classNames: [classes.join(" ")],
    labels: null,
    next: [
      {
        // The three classless "item" boxes of the legacy flex demo. Classless siblings would
        // collapse to a single node, so one node with three labels replicates them instead.
        tag: "div",
        classNames: null,
        labels: ["item", "item", "item"],
        next: null,
      },
    ],
  })),
};

export default flexModel;
