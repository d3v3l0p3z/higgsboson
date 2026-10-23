export const avatarModel = {
  title: "Avatar",
  nodes: [
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
              src: "https://javierlopezdeancos.dev/img/22B5veeUxB-150.webp",
              alt: "Higgsboson avatar example",
            },
          ],
          next: null,
        },
      ],
    },
  ],
};

export default avatarModel;
