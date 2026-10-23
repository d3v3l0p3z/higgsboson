export const avatarsModel = {
  title: "Avatars",
  nodes: [
    {
      tag: "ul",
      classNames: ["hggs-avatars"],
      labels: null,
      next: [
        {
          tag: "li",
          classNames: ["hggs-avatars-item"],
          next: [
            {
              tag: "figure",
              classNames: ["hggs-avatar", "hggs-avatar hggs-avatar--big", "hggs-avatar hggs-avatar--small"],
              labels: null,
              next: [
                {
                  tag: "img",
                  classNames: ["hggs-avatar-image"],
                  attributes: [
                    {
                      src: "https://javierlopezdeancos.dev/img/st09FDI0DN-500.webp",
                      alt: "higgsboson avatar example",
                    },
                    {
                      src: "https://avatars.githubusercontent.com/u/951580?v=4",
                      alt: "higgsboson avatar example",
                    },
                    {
                      src: "https://avatars.githubusercontent.com/u/539546?v=4",
                      alt: "higgsboson avatar example",
                    },
                  ],
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

export default avatarsModel;
