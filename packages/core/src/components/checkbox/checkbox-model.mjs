const checkboxData = {
  title: "Checkbox",
  cases: ["Checkbox", "Checkbox group"],
  nodes: [
    {
      tag: "div",
      classNames: ["hggs-checkbox"],
      labels: null,
      next: [
        {
          tag: "input",
          classNames: ["hggs-checkbox-input"],
          attributes: { name: "checkbox", type: "checkbox" },
          labels: null,
          next: null,
        },
        {
          tag: "label",
          classNames: ["hggs-checkbox-label"],
          labels: ["Option 1"],
          next: null,
        },
      ],
    },
    {
      tag: "div",
      classNames: ["hggs-checkboxes"],
      labels: null,
      next: [
        {
          tag: "div",
          classNames: ["hggs-checkbox"],
          labels: null,
          next: [
            {
              tag: "input",
              classNames: ["hggs-checkbox-input"],
              attributes: {
                name: "checkbox",
                type: "checkbox",
              },
              labels: null,
              next: null,
            },
            {
              tag: "label",
              classNames: ["hggs-checkbox-label"],
              labels: ["Option 1", "Option 2", "Option 3"],
              next: null,
            },
          ],
        },
      ],
    },
  ],
};

export default checkboxData;
