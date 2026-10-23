const optionModel = {
  title: "Option",
  nodes: [
    {
      tag: "optgroup",
      classNames: null,
      // empty label: the renderer drops nodes that have neither classNames nor labels
      labels: [""],
      next: [
        {
          tag: "option",
          classNames: ["hggs-option"],
          labels: ["First option."],
          attributes: { value: "First option." },
          next: null,
        },
        {
          tag: "option",
          classNames: ["hggs-option"],
          labels: ["Second option."],
          attributes: { value: "Second option." },
          next: null,
        },
        {
          tag: "option",
          classNames: ["hggs-option"],
          labels: ["Third option."],
          attributes: { value: "Third option." },
          next: null,
        },
        {
          tag: "option",
          classNames: ["hggs-option"],
          labels: ["Fourth option."],
          attributes: { value: "Fourth option." },
          next: null,
        },
        {
          tag: "option",
          classNames: ["hggs-option"],
          labels: ["Sixth option."],
          attributes: { value: "Sixth option." },
          next: null,
        },
        {
          tag: "option",
          classNames: ["hggs-option"],
          labels: ["Seventh option."],
          attributes: { value: "Seventh option." },
          next: null,
        },
      ],
    },
  ],
};

export default optionModel;
