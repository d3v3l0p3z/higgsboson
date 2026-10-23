const chanante =
  "Chanante ipsum dolor sit amet, soooy crossoverr nisi forrondosco dolore ahí va qué chorrazo chotera eveniet atiendee. Chachachá ut a tope con la maquinaria, zagal gambitero ea sed enratonao pepinoninoni saepe. Coconut estoy fatal de lo mío adipisicing cabeza de viejo cuerpo de joven chavalada eiusmod to sueltecico enjuto mojamuto bonico del tó. Cascoporro con las rodillas in the guanter piticli vivo con tu madre en un castillo freshquisimo ayy qué gustico tontaco. Asquerosito aliqua eres un pirámidee ojete calor ea agazapao. Churretoso nuiiiii exercitation pero qué pelazo monguer Guaper interneeeer melifluo droja payacho mamellas.";

export const textModel = {
  title: "Text",
  cases: [
    "Text",
    "Text italic",
    "Text small",
    "Text bold",
    "Text align center",
    "Text align right",
    "Text balanced",
    "Texts",
  ],
  nodes: [
    {
      tag: "p",
      classNames: ["hggs-text"],
      labels: [chanante],
      next: null,
    },
    {
      tag: "p",
      classNames: ["hggs-text hggs-text--italic"],
      labels: [chanante],
      next: null,
    },
    {
      tag: "p",
      classNames: ["hggs-text hggs-text--small"],
      labels: [chanante],
      next: null,
    },
    {
      tag: "p",
      classNames: ["hggs-text hggs-text--bold"],
      labels: [chanante],
      next: null,
    },
    {
      tag: "p",
      classNames: ["hggs-text hggs-text--align-center"],
      labels: [chanante],
      next: null,
    },
    {
      tag: "p",
      classNames: ["hggs-text hggs-text--align-right"],
      labels: [chanante],
      next: null,
    },
    {
      tag: "p",
      classNames: ["hggs-text hggs-text--balanced"],
      labels: [chanante],
      next: null,
    },
    {
      tag: "div",
      classNames: ["hggs-texts"],
      labels: null,
      next: [
        {
          tag: "p",
          classNames: ["hggs-text"],
          labels: [chanante, chanante, chanante, chanante],
          next: null,
        },
      ],
    },
  ],
};

export default textModel;
