const CHANANTE =
  "Chanante ipsum dolor sit amet, soooy crossoverr nisi forrondosco dolore ahí va qué chorrazo chotera eveniet atiendee. Chachachá ut a tope con la maquinaria, zagal gambitero ea sed enratonao pepinoninoni saepe.";

const LEVELS = ["h1", "h2", "h3", "h4", "h5", "h6"];

const titlesModel = {
  title: "Title",
  cases: [
    ...LEVELS,
    ...LEVELS.map((level) => `${level} unbalanced`),
    ...LEVELS.map((level) => `${level} align center`),
  ],
  nodes: [
    ...LEVELS.map((level) => ({
      tag: level,
      classNames: [`hggs-${level}`],
      labels: [`This is an ${level} title`],
      next: null,
    })),
    ...LEVELS.map((level) => ({
      tag: level,
      classNames: [`hggs-${level} hggs-title--unbalanced`],
      labels: [CHANANTE],
      next: null,
    })),
    ...LEVELS.map((level) => ({
      tag: level,
      classNames: [`hggs-${level} hggs-title--align-center`],
      labels: [CHANANTE],
      next: null,
    })),
  ],
};

export default titlesModel;
