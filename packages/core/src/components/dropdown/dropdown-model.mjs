const dropdownModel = {
  title: "Dropdown",
  nodes: [
    {
      tag: "details",
      classNames: ["hggs-dropdown"],
      labels: null,
      next: [
        {
          tag: "summary",
          classNames: ["hggs-dropdown-selected-options"],
          labels: null,
          next: [
            {
              tag: "input",
              // the label acts as the id differentiator (inputs are void, its text never renders)
              classNames: ["hggs-dropdown-selected-option"],
              labels: ["Select an item..."],
              attributes: { type: "radio", name: "hggs-dropdown-item", title: "Select an item...", checked: "" },
              next: null,
            },
            {
              tag: "input",
              classNames: ["hggs-dropdown-selected-option"],
              labels: ["Item 1"],
              attributes: { type: "radio", name: "hggs-dropdown-item", title: "Item 1" },
              next: null,
            },
            {
              tag: "input",
              classNames: ["hggs-dropdown-selected-option"],
              labels: ["Item 2"],
              attributes: { type: "radio", name: "hggs-dropdown-item", title: "Item 2" },
              next: null,
            },
            {
              tag: "input",
              classNames: ["hggs-dropdown-selected-option"],
              labels: ["Item 3"],
              attributes: { type: "radio", name: "hggs-dropdown-item", title: "Item 3" },
              next: null,
            },
            {
              tag: "input",
              classNames: ["hggs-dropdown-selected-option"],
              labels: ["Item 4"],
              attributes: { type: "radio", name: "hggs-dropdown-item", title: "Item 4" },
              next: null,
            },
            {
              tag: "input",
              classNames: ["hggs-dropdown-selected-option"],
              labels: ["Item 5"],
              attributes: { type: "radio", name: "hggs-dropdown-item", title: "Item 5" },
              next: null,
            },
          ],
        },
        {
          tag: "ul",
          classNames: ["hggs-dropdown-options"],
          labels: null,
          next: [
            {
              tag: "li",
              // repeated class keeps every li id unique (the renderer dedupes identical
              // siblings); classList collapses the repeats so the class stays the same
              classNames: ["hggs-dropdown-option"],
              labels: null,
              next: [
                {
                  tag: "label",
                  classNames: ["hggs-dropdown-option-label"],
                  // the renderer wires the first (input, label) pair of the dropdown;
                  // the remaining for values mirror the auto ids of the inputs (see mock)
                  labels: ["Select an item..."],
                  attributes: {
                    for: "edge-0 --> tag-details --> class-hggs-dropdown-0 --> tag-summary --> class-hggs-dropdown-selected-options-0 --> tag-input --> class-hggs-dropdown-selected-option-0 --> label-select-an-item-0",
                  },
                  next: null,
                },
              ],
            },
            {
              tag: "li",
              classNames: ["hggs-dropdown-option hggs-dropdown-option"],
              labels: null,
              next: [
                {
                  tag: "label",
                  classNames: ["hggs-dropdown-option-label"],
                  labels: ["Item 1"],
                  attributes: {
                    for: "edge-0 --> tag-details --> class-hggs-dropdown-0 --> tag-summary --> class-hggs-dropdown-selected-options-0 --> tag-input --> class-hggs-dropdown-selected-option-0 --> label-item-1-0",
                  },
                  next: null,
                },
              ],
            },
            {
              tag: "li",
              classNames: ["hggs-dropdown-option hggs-dropdown-option hggs-dropdown-option"],
              labels: null,
              next: [
                {
                  tag: "label",
                  classNames: ["hggs-dropdown-option-label"],
                  labels: ["Item 2"],
                  attributes: {
                    for: "edge-0 --> tag-details --> class-hggs-dropdown-0 --> tag-summary --> class-hggs-dropdown-selected-options-0 --> tag-input --> class-hggs-dropdown-selected-option-0 --> label-item-2-0",
                  },
                  next: null,
                },
              ],
            },
            {
              tag: "li",
              classNames: ["hggs-dropdown-option hggs-dropdown-option hggs-dropdown-option hggs-dropdown-option"],
              labels: null,
              next: [
                {
                  tag: "label",
                  classNames: ["hggs-dropdown-option-label"],
                  labels: ["Item 3"],
                  attributes: {
                    for: "edge-0 --> tag-details --> class-hggs-dropdown-0 --> tag-summary --> class-hggs-dropdown-selected-options-0 --> tag-input --> class-hggs-dropdown-selected-option-0 --> label-item-3-0",
                  },
                  next: null,
                },
              ],
            },
            {
              tag: "li",
              classNames: [
                "hggs-dropdown-option hggs-dropdown-option hggs-dropdown-option hggs-dropdown-option hggs-dropdown-option",
              ],
              labels: null,
              next: [
                {
                  tag: "label",
                  classNames: ["hggs-dropdown-option-label"],
                  labels: ["Item 4"],
                  attributes: {
                    for: "edge-0 --> tag-details --> class-hggs-dropdown-0 --> tag-summary --> class-hggs-dropdown-selected-options-0 --> tag-input --> class-hggs-dropdown-selected-option-0 --> label-item-4-0",
                  },
                  next: null,
                },
              ],
            },
            {
              tag: "li",
              classNames: [
                "hggs-dropdown-option hggs-dropdown-option hggs-dropdown-option hggs-dropdown-option hggs-dropdown-option hggs-dropdown-option",
              ],
              labels: null,
              next: [
                {
                  tag: "label",
                  classNames: ["hggs-dropdown-option-label"],
                  labels: ["Item 5"],
                  attributes: {
                    for: "edge-0 --> tag-details --> class-hggs-dropdown-0 --> tag-summary --> class-hggs-dropdown-selected-options-0 --> tag-input --> class-hggs-dropdown-selected-option-0 --> label-item-5-0",
                  },
                  next: null,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default dropdownModel;
