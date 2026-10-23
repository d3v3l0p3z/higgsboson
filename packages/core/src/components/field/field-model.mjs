const fieldModel = {
  title: "Field",
  cases: ["Field", "Field required", "Field focus", "Field disabled", "Field error"],
  nodes: [
    {
      tag: "div",
      classNames: ["hggs-field"],
      labels: null,
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
    {
      tag: "div",
      classNames: ["hggs-field hggs-field--required"],
      labels: null,
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
          attributes: { name: "field", type: "text" },
          labels: null,
          next: null,
        },
      ],
    },
    {
      tag: "div",
      classNames: ["hggs-field"],
      labels: null,
      next: [
        {
          tag: "label",
          classNames: ["hggs-label hggs-label--focus"],
          labels: ["Label"],
          next: null,
        },
        {
          tag: "input",
          classNames: ["hggs-input hggs-input--focus"],
          attributes: { name: "field", type: "text" },
          labels: null,
          next: null,
        },
      ],
    },
    {
      tag: "div",
      classNames: ["hggs-field"],
      labels: null,
      next: [
        {
          tag: "label",
          classNames: ["hggs-label hggs-label--disabled"],
          labels: ["Label"],
          next: null,
        },
        {
          tag: "input",
          classNames: ["hggs-input hggs-input--disabled"],
          attributes: { name: "field", type: "text" },
          labels: null,
          next: null,
        },
      ],
    },
    {
      tag: "div",
      classNames: ["hggs-field"],
      labels: null,
      next: [
        {
          tag: "label",
          classNames: ["hggs-label hggs-label--error"],
          labels: ["Label"],
          next: null,
        },
        {
          tag: "input",
          classNames: ["hggs-input hggs-input--error"],
          attributes: { name: "field", type: "text" },
          labels: null,
          next: null,
        },
      ],
    },
  ],
};

export default fieldModel;
