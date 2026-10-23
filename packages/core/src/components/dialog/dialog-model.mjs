export const dialogModel = {
  title: "Dialog",
  nodes: [
    {
      tag: "div",
      classNames: ["hggs-container"],
      labels: null,
      next: [
        {
          tag: "dialog",
          id: "hggs-dialog-id",
          classNames: [
            "hggs-dialog hggs-dialog--big",
            "hggs-dialog hggs-dialog--medium",
            "hggs-dialog hggs-dialog--small",
          ],
          labels: null,
          next: [
            {
              tag: "header",
              classNames: ["hggs-dialog-header"],
              labels: null,
              next: [
                {
                  tag: "button",
                  attributes: [
                    {
                      command: "close",
                      commandfor: "hggs-dialog-id",
                    },
                  ],
                  classNames: ["hggs-dialog-close hggs-button hggs-button--quaternary"],
                  labels: null,
                  next: [
                    {
                      tag: "span",
                      classNames: ["hggs-icon hggs-icon--close"],
                      labels: null,
                      next: null,
                    },
                  ],
                },
              ],
            },
            {
              tag: "section",
              classNames: ["hggs-dialog-body"],
              labels: null,
              next: [
                {
                  tag: "p",
                  classNames: ["hggs-text"],
                  labels: [
                    "Chanante ipsum dolor sit amet, eiusmod eres un pirámidee mangurrián magna veniam magna exercitation asobinao. Estoy fatal de lo mío piticli eiusmod aliqua nisi ut incididunt adipisicing dolore. Veniam ea pero qué pelazo incididunt ut.",
                  ],
                  next: null,
                },
              ],
            },
            {
              tag: "footer",
              classNames: ["hggs-dialog-footer"],
              labels: null,
              next: [
                {
                  tag: "div",
                  classNames: ["hggs-dialog-actions"],
                  labels: null,
                  next: [
                    {
                      tag: "button",
                      attributes: [
                        {
                          command: "close",
                          commandfor: "hggs-dialog-id",
                        },
                      ],
                      classNames: ["hggs-button hggs-button--primary hggs-button--medium"],
                      labels: ["Ok"],
                      next: null,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          tag: "button",
          attributes: [
            {
              command: "show-modal",
              commandfor: "hggs-dialog-id",
            },
          ],
          classNames: [
            "hggs-button hggs-button--primary hggs-button--big",
            "hggs-button hggs-button--primary hggs-button--medium",
            "hggs-button hggs-button--primary hggs-button--small",
          ],
          labels: ["Big", "Medium", "Small"],
          next: null,
        },
      ],
    },
  ],
};

export default dialogModel;
