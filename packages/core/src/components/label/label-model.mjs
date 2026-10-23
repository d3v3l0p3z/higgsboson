export const labelModel = {
  title: "Label",
  nodes: [
    {
      tag: "label",
      classNames: ["hggs-label"],
      attributes: { for: "id-test" },
      labels: ["Label"],
      next: null,
    },
    {
      tag: "label",
      classNames: ["hggs-label hggs-label--focus"],
      attributes: { for: "id-test" },
      labels: ["Label"],
      next: null,
    },
    {
      tag: "label",
      classNames: ["hggs-label hggs-label--disabled"],
      attributes: { for: "id-test" },
      labels: ["Label"],
      next: null,
    },
  ],
};

export default labelModel;
