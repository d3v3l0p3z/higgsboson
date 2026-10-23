const radioModel = {
  title: "Radio",
  nodes: [
    {
      tag: "div",
      classNames: ["hggs-radios"],
      labels: null,
      next: [
        {
          tag: "div",
          classNames: ["hggs-radio"],
          labels: null,
          next: [
            {
              tag: "input",
              classNames: null,
              // empty label: classless nodes are only kept when they carry a label
              labels: [""],
              attributes: { type: "radio", name: "radiogroup" },
              next: null,
            },
            {
              tag: "span",
              // empty label keeps the classless node; hggs-radio-dot matches no css rule
              classNames: ["hggs-radio-dot"],
              labels: null,
              next: null,
            },
            {
              tag: "label",
              classNames: ["hggs-label"],
              // for is wired by the renderer to the input description id
              labels: ["Option 1"],
              next: null,
            },
          ],
        },
        {
          tag: "div",
          // duplicated class token: distinct description id while classList collapses to hggs-radio
          // (a labels-based differentiator here would corrupt sibling batches — labels on a node with
          // next siblings inflate countAddedThisNode and replicate children across previous siblings)
          classNames: ["hggs-radio hggs-radio"],
          labels: null,
          next: [
            {
              tag: "input",
              classNames: null,
              labels: [""],
              attributes: { type: "radio", name: "radiogroup" },
              next: null,
            },
            {
              tag: "span",
              classNames: ["hggs-radio-dot"],
              labels: null,
              next: null,
            },
            {
              tag: "label",
              classNames: ["hggs-label"],
              // the renderer only wires the first (input, label) pair; this for mirrors the
              // auto-generated id of the second input (see radio-mock.html)
              labels: ["Option 2"],
              attributes: {
                for: "edge-0 --> tag-div --> class-hggs-radios-0 --> tag-div --> class-hggs-radio-hggs-radio-0 --> tag-input --> label--0",
              },
              next: null,
            },
          ],
        },
      ],
    },
  ],
};

export default radioModel;
