export const model = {
  title: "List",
  structures: [
    {
      tag: "ul",
      classes: ["hggs-list"],
      labels: null,
      next: [
        {
          tag: "li",
          classes: ["hggs-list-item", "hggs-list-item hggs-list--marker"],
          labels: [
            "First item on the list.",
            "Second item on the list.",
            "Third term on the list.",
            "Fourth term on the list.",
            "Five term on the list.",
            "Sixth term on the list.",
            "Seventh term on the list.",
          ],
          next: null,
        },
      ],
    },
  ],
};

export default model;
