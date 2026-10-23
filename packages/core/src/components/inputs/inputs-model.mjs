const inputsModel = {
  title: "Input",
  nodes: [
    {
      tag: "input",
      classNames: ["hggs-input hggs-input--big"],
      attributes: { type: "text", placeholder: "write here some text..." },
      labels: null,
      next: null,
    },
    {
      tag: "input",
      classNames: ["hggs-input"],
      attributes: { type: "text", placeholder: "write here some text..." },
      labels: null,
      next: null,
    },
    {
      tag: "input",
      classNames: ["hggs-input hggs-input--small"],
      attributes: { type: "text", placeholder: "write here some text..." },
      labels: null,
      next: null,
    },
    {
      tag: "input",
      classNames: ["hggs-input hggs-input--disabled"],
      attributes: { type: "text", disabled: "", value: "I'm disable" },
      labels: null,
      next: null,
    },
    {
      tag: "input",
      classNames: ["hggs-input hggs-input--error"],
      attributes: { type: "text", error: "", value: "I have errors" },
      labels: null,
      next: null,
    },
  ],
};

export default inputsModel;
