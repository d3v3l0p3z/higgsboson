export const model = {
  title: "List",
  structure: {
    tag: "ul",
    classes: ["hggs-list"],
    modifiers: null,
    labels: null,
    next: {
      tag: "li",
      classes: ["hggs-list-item"],
      modifiers: ["hggs-list--marker"],
      labels: [
        "First item on the list.",
        "Second item on the list.",
        "Third term on the list.",
        "Fourth term on the list.",
        "Sixth term on the list.",
        "Seventh term on the list.",
      ],
    },
  },
};

export default model;
