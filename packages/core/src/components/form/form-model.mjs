const formModel = {
  title: "Form",
  cases: ["Form with two inputs", "Form with two fields"],
  nodes: [
    {
      tag: "form",
      classNames: ["hggs-form"],
      labels: null,
      next: [
        {
          tag: "input",
          classNames: ["hggs-input"],
          attributes: { type: "text" },
          // two empty labels replicate this identical input instead of deduplicating it
          labels: ["", ""],
          next: null,
        },
      ],
    },
    {
      tag: "form",
      classNames: ["hggs-form"],
      labels: null,
      next: [
        {
          tag: "div",
          classNames: ["hggs-field"],
          // two empty labels replicate this identical field instead of deduplicating it
          labels: ["", ""],
          next: [
            {
              tag: "label",
              classNames: ["hggs-label"],
              labels: ["Label"],
              next: null,
            },
            {
              tag: "input",
              classNames: ["hggs-input"],
              // name keeps the renderer from rewriting this text input as a checkbox
              attributes: { name: "field", type: "text" },
              labels: null,
              next: null,
            },
          ],
        },
      ],
    },
  ],
};

export default formModel;
