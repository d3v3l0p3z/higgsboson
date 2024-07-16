export const model = {
  title: "Avatar",
  structures: [
    {
      tag: "figure",
      classes: ["hggs-avatar", "hggs-avatar hggs-avatar--big", "hggs-avatar hggs-avatar--small"],
      labels: null,
      next: [
        {
          tag: "img",
          classes: ["hggs-avatar-image"],
          attributes: [
            {
              src: "https://javierlopezdeancos.dev/img/st09FDI0DN-500.webp",
              alt: "Higgsboson avatar example",
            },
          ],
          next: null,
        },
      ],
    },
  ],
};

export default model;
