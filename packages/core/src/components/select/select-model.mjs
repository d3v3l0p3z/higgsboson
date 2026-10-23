const selectModel = {
  title: "Select",
  nodes: [
    {
      tag: "div",
      classNames: ["hggs-select-wrapper"],
      labels: null,
      next: [
        {
          tag: "select",
          classNames: ["hggs-select"],
          labels: null,
          attributes: { name: "pets" },
          next: [
            {
              tag: "option",
              classNames: ["hggs-option"],
              labels: ["Please choose an option"],
              attributes: { value: "" },
              next: null,
            },
            {
              tag: "option",
              classNames: ["hggs-option"],
              labels: ["Dog"],
              attributes: { value: "dog" },
              next: null,
            },
            {
              tag: "option",
              classNames: ["hggs-option"],
              labels: ["Cat"],
              attributes: { value: "cat" },
              next: null,
            },
            {
              tag: "option",
              classNames: ["hggs-option"],
              labels: ["Hamster"],
              attributes: { value: "hamster" },
              next: null,
            },
            {
              tag: "option",
              classNames: ["hggs-option"],
              labels: ["Parrot"],
              attributes: { value: "parrot" },
              next: null,
            },
            {
              tag: "option",
              classNames: ["hggs-option"],
              labels: ["Spider"],
              attributes: { value: "spider" },
              next: null,
            },
            {
              tag: "option",
              classNames: ["hggs-option"],
              labels: ["Goldfish"],
              attributes: { value: "goldfish" },
              next: null,
            },
          ],
        },
        {
          tag: "span",
          classNames: ["hggs-icon hggs-icon--chevron-down"],
          labels: null,
          next: null,
        },
      ],
    },
  ],
};

export default selectModel;
