const switchModel = {
  title: "Switch",
  nodes: [
    {
      tag: "div",
      classNames: ["hggs-switch"],
      labels: null,
      next: [
        {
          tag: "input",
          classNames: null,
          // empty label: classless nodes are only kept when they carry a label
          labels: [""],
          attributes: { type: "checkbox", id: "switch-1" },
          next: null,
        },
        {
          tag: "label",
          // hggs-label keeps the classless node renderable; its text is hidden by the
          // switch styles (text-indent: -9999px) so the class is visually inert here
          classNames: ["hggs-label"],
          labels: ["Switch"],
          attributes: { for: "switch-1" },
          next: null,
        },
        {
          tag: "label",
          classNames: ["hggs-label"],
          labels: ["Active Superpowers"],
          attributes: { for: "switch-1" },
          next: null,
        },
      ],
    },
  ],
};

export default switchModel;
