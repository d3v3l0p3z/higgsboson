export const boxModel = {
  title: "Box",
  cases: [
    "Box",
    "Box rounded",
    "Box primary",
    "Box primary rounded",
    "Box with header and body",
    "Box with header and body rounded",
    "Box with header and body primary",
    "Box with header and body primary rounded",
  ],
  nodes: [
    {
      tag: "div",
      classNames: [
        "hggs-box",
        "hggs-box hggs-box--rounded",
        "hggs-box hggs-box--primary",
        "hggs-box hggs-box--primary hggs-box--rounded",
      ],
      labels: null,
      next: null,
    },
    {
      tag: "div",
      classNames: [
        "hggs-box",
        "hggs-box hggs-box--rounded",
        "hggs-box hggs-box--primary",
        "hggs-box hggs-box--primary hggs-box--rounded",
      ],
      labels: null,
      next: [
        {
          tag: "header",
          classNames: ["hggs-box-header"],
          labels: null,
          next: [
            {
              tag: "h4",
              classNames: ["hggs-h4"],
              labels: ["Title to this box"],
              next: null,
            },
          ],
        },
        {
          tag: "section",
          classNames: ["hggs-box-body"],
          labels: null,
          next: [
            {
              tag: "p",
              classNames: ["hggs-text"],
              labels: [
                "Chanante ipsum dolor sit amet, soooy crossoverr nisi forrondosco dolore ahí va qué chorrazo chotera eveniet atiendee. Chachachá ut a tope con la maquinaria, zagal gambitero ea sed enratonao pepinoninoni saepe. Coconut estoy fatal de lo mío adipisicing cabeza de viejo cuerpo de joven chavalada eiusmod to sueltecico enjuto mojamuto bonico del tó. Cascoporro con las rodillas in the guanter piticli vivo con tu madre en un castillo freshquisimo ayy qué gustico tontaco. Asquerosito aliqua eres un pirámidee ojete calor ea agazapao. Churretoso nuiiiii exercitation pero qué pelazo monguer Guaper interneeeer melifluo droja payacho mamellas.",
              ],
              next: null,
            },
          ],
        },
      ],
    },
  ],
};

export default boxModel;
