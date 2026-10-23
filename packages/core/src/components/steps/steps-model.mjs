/**
 * Steps model: 6 default entries + 11 vertical entries, 5 items each.
 *
 * The default and vertical legacy templates differ in structure:
 * - default: the state icons ride on the (always rendered) reference span inside the signal;
 *   the divider lives inside main after the title.
 * - vertical: numbered items render a reference span, state items render either a reference or
 *   an icon span depending on the entry; the divider is a direct child of side.
 *
 * Items 0 and 1 of every entry share identical step classes, so item 1 repeats the class tokens
 * (uniqueSibling) to keep the generated description ids distinct; classList normalization keeps
 * the serialized class attribute identical to the legacy markup.
 */

// The renderer collapses classless siblings, so items 0/1 (identical classes) are told apart by
// repeating the class tokens: ids differ, the rendered class attribute stays the same.
const uniqueSibling = (className, occurrence) =>
  occurrence === 0
    ? className
    : Array(occurrence + 1)
        .fill(className)
        .join(" ");

const STEP_LABELS = [
  { title: "Personal data", description: "Set your personal data", side: "1" },
  { title: "Financial data", description: "Set your financial data", side: "2" },
  { title: "Terms and conditions", description: "Read and sign terms and conditions" },
  { title: "Summary", description: "This step contains errors that you need to fix" },
  { title: "Payment", description: "Waiting..." },
];

const STATES = {
  2: { modifier: "hggs-step--complete", icon: "hggs-icon--check" },
  3: { modifier: "hggs-step--error", icon: "hggs-icon--close" },
  4: { modifier: "hggs-step--waiting", icon: "hggs-icon--pending" },
};

// dividerOnStep: the --divider step modifier on items 0-3 (the divider ELEMENT renders on
// items 0-3 in every entry). iconInReference: state icons on the reference span (vertical
// entries 0/1/5-8) instead of the dedicated icon span. smallIcon: adds hggs-icon--small.
const ENTRIES = [
  { template: "default", dividerOnStep: true, mods: [] },
  { template: "default", dividerOnStep: true, mods: ["hggs-step--no-description"] },
  { template: "default", dividerOnStep: true, mods: ["hggs-step--small"] },
  { template: "default", dividerOnStep: true, mods: ["hggs-step--small", "hggs-step--no-description"] },
  { template: "default", dividerOnStep: true, mods: ["hggs-step--dot"] },
  { template: "default", dividerOnStep: true, mods: ["hggs-step--dot", "hggs-step--no-description"] },
  { template: "vertical", dividerOnStep: true, iconInReference: true, mods: ["hggs-step--vertical"] },
  {
    template: "vertical",
    dividerOnStep: true,
    iconInReference: true,
    smallIcon: true,
    mods: ["hggs-step--vertical", "hggs-step--small"],
  },
  {
    template: "vertical",
    dividerOnStep: true,
    iconInReference: false,
    mods: ["hggs-step--vertical", "hggs-step--no-description"],
  },
  {
    template: "vertical",
    dividerOnStep: true,
    iconInReference: false,
    smallIcon: true,
    mods: ["hggs-step--vertical", "hggs-step--no-description", "hggs-step--small"],
  },
  {
    template: "vertical",
    dividerOnStep: true,
    iconInReference: false,
    smallIcon: true,
    mods: ["hggs-step--vertical", "hggs-step--no-description", "hggs-step--dot"],
  },
  { template: "vertical", dividerOnStep: false, iconInReference: true, mods: ["hggs-step--vertical"] },
  {
    template: "vertical",
    dividerOnStep: false,
    iconInReference: true,
    mods: ["hggs-step--vertical", "hggs-step--no-description"],
  },
  {
    template: "vertical",
    dividerOnStep: false,
    iconInReference: true,
    smallIcon: true,
    mods: ["hggs-step--vertical", "hggs-step--small"],
  },
  {
    template: "vertical",
    dividerOnStep: false,
    iconInReference: true,
    smallIcon: true,
    mods: ["hggs-step--vertical", "hggs-step--no-description", "hggs-step--small"],
  },
  {
    template: "vertical",
    dividerOnStep: false,
    iconInReference: false,
    smallIcon: true,
    mods: ["hggs-step--vertical", "hggs-step--dot"],
  },
  {
    template: "vertical",
    dividerOnStep: false,
    iconInReference: false,
    smallIcon: true,
    mods: ["hggs-step--vertical", "hggs-step--no-description", "hggs-step--dot"],
  },
];

// Auto labels would collide heavily (6 bare "Steps" roots, 11 "Steps vertical" roots).
const CASES = [
  "Steps",
  "Steps no description",
  "Steps small",
  "Steps small no description",
  "Steps dot",
  "Steps dot no description",
  "Steps vertical",
  "Steps vertical small",
  "Steps vertical no description",
  "Steps vertical small no description",
  "Steps vertical dot no description",
  "Steps vertical no divider",
  "Steps vertical no divider no description",
  "Steps vertical no divider small",
  "Steps vertical no divider small no description",
  "Steps vertical no divider dot",
  "Steps vertical no divider dot no description",
];

const iconClassNames = (state, smallIcon) => {
  const classes = ["hggs-icon", state.icon, "hggs-icon--quinary"];

  if (smallIcon) {
    classes.push("hggs-icon--small");
  }

  return classes.join(" ");
};

const stepClassNames = (entry, index) => {
  const classes = ["hggs-step", ...entry.mods];
  const state = STATES[index];

  // The --divider modifier appears on items 0-3; the waiting item (4) never carries it.
  if (index < 4 && entry.dividerOnStep) {
    classes.push("hggs-step--divider");
  }

  if (state) {
    classes.push(state.modifier);
  }

  return classes.join(" ");
};

/** One <li>: side (signal + vertical divider) and body (main + description). */
const stepItemNode = (entry, index) => {
  const label = STEP_LABELS[index];
  const state = STATES[index];
  const isVertical = entry.template === "vertical";

  // Signal content: default always renders the reference span (icon classes on state items);
  // vertical renders a reference span for numbered items and for iconInReference state items,
  // otherwise an icon span.
  const usesIconSpan = isVertical && state && !entry.iconInReference;

  const signalNode = {
    tag: "div",
    classNames: ["hggs-step-signal"],
    labels: null,
    next: usesIconSpan
      ? [
          {
            tag: "span",
            classNames: [iconClassNames(state, entry.smallIcon)],
            labels: null,
            next: null,
          },
        ]
      : [
          {
            tag: "span",
            classNames: [state ? iconClassNames(state, entry.smallIcon) : "hggs-step-reference"],
            labels: state ? null : [label.side],
            next: null,
          },
        ],
  };

  const sideNode = {
    tag: "span",
    classNames: ["hggs-step-side"],
    labels: null,
    next: [signalNode],
  };

  // The divider element renders on items 0-3: inside side for vertical, inside main for default.
  if (index < 4 && isVertical) {
    sideNode.next.push({ tag: "span", classNames: ["hggs-step-divider"], labels: null, next: null });
  }

  const mainChildren = [{ tag: "span", classNames: ["hggs-step-title"], labels: [label.title], next: null }];

  if (index < 4 && !isVertical) {
    mainChildren.push({ tag: "span", classNames: ["hggs-step-divider"], labels: null, next: null });
  }

  return {
    tag: "li",
    // Items 0 and 1 share identical step classes; item 1 repeats the tokens for a unique id.
    classNames: [uniqueSibling(stepClassNames(entry, index), index === 1 ? 1 : 0)],
    labels: null,
    next: [
      sideNode,
      {
        tag: "div",
        classNames: ["hggs-step-body"],
        labels: null,
        next: [
          { tag: "div", classNames: ["hggs-step-main"], labels: null, next: mainChildren },
          { tag: "span", classNames: ["hggs-step-description"], labels: [label.description], next: null },
        ],
      },
    ],
  };
};

const stepsModel = {
  title: "Steps",
  cases: CASES,
  nodes: ENTRIES.map((entry) => ({
    tag: "ul",
    classNames: [entry.template === "vertical" ? "hggs-steps hggs-steps--vertical" : "hggs-steps"],
    labels: null,
    next: STEP_LABELS.map((_, index) => stepItemNode(entry, index)),
  })),
};

export default stepsModel;
