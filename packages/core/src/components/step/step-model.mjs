/**
 * Step model: 66 examples across the legacy template's branches.
 *
 * Branch notes (all verified against the live legacy page):
 * - default renders the step with div tags (the legacy template's stray `</article>` closing tag
 *   is repaired by the HTML parser); the other branches use article/section/footer tags.
 * - dot steps render an EMPTY signal (no reference span).
 * - state steps put an icon span in the signal; dot-state entries (completed/error) have no icon
 *   class in the legacy data and render a classless span (labels [""] keeps it in the tree).
 * - vertical steps keep the divider as a direct child of side (never inside main); the divider
 *   ELEMENT renders only when the legacy entry sets titles.divider (hasDivider below), which does
 *   not always match the --divider step modifier (vertical states entries keep the divider class
 *   on every step, and two small entries render the divider without the modifier).
 * - vertical small entry 1 has no description class, so its footer does not render.
 */

const MOD = {
  divider: "hggs-step--divider",
  small: "hggs-step--small",
  noDescription: "hggs-step--no-description",
  dot: "hggs-step--dot",
  vertical: "hggs-step--vertical",
  complete: "hggs-step--complete",
  error: "hggs-step--error",
  waiting: "hggs-step--waiting",
};

const { divider, small, noDescription, dot, vertical, complete, error, waiting } = MOD;

const iconClassNames = (icon, smallIcon) =>
  ["hggs-icon", `hggs-icon--${icon}`, "hggs-icon--quinary", ...(smallIcon ? ["hggs-icon--small"] : [])].join(" ");

const CHECK = iconClassNames("check", false);
const CHECK_SMALL = iconClassNames("check", true);
const CLOSE = iconClassNames("close", false);
const CLOSE_SMALL = iconClassNames("close", true);
const PENDING = iconClassNames("pending", false);
const PENDING_SMALL = iconClassNames("pending", true);

// hasDivider mirrors the legacy titles.divider flag that gates the divider ELEMENT; icon null
// means the legacy data has no icon class (the template still renders a classless span).
const DEFAULT = [
  { mods: [divider], hasDivider: true },
  { mods: [], hasDivider: false },
  { mods: [noDescription], hasDivider: false },
];

const SMALL = [
  { mods: [divider, small], hasDivider: true },
  { mods: [small], hasDivider: false },
  { mods: [small, noDescription], hasDivider: false },
];

const DOT = [
  { mods: [divider, dot], hasDivider: true },
  { mods: [dot], hasDivider: false },
  { mods: [dot, noDescription], hasDivider: false },
];

const STATES = {
  completed: [
    { mods: [divider, complete], hasDivider: true, icon: CHECK },
    { mods: [complete], hasDivider: false, icon: CHECK },
    { mods: [divider, small, complete], hasDivider: true, icon: CHECK_SMALL },
    { mods: [small, complete], hasDivider: false, icon: CHECK_SMALL },
    { mods: [small, complete, noDescription], hasDivider: false, icon: CHECK_SMALL },
    { mods: [divider, dot, complete], hasDivider: true, icon: null },
    { mods: [dot, complete], hasDivider: false, icon: null },
    { mods: [dot, noDescription, complete], hasDivider: false, icon: null },
  ],
  error: [
    { mods: [divider, error], hasDivider: true, icon: CLOSE },
    { mods: [error], hasDivider: false, icon: CLOSE },
    { mods: [error, noDescription], hasDivider: false, icon: CLOSE },
    { mods: [small, divider, error], hasDivider: true, icon: CLOSE_SMALL },
    { mods: [small, error], hasDivider: false, icon: CLOSE_SMALL },
    { mods: [small, error, noDescription], hasDivider: false, icon: CLOSE_SMALL },
    { mods: [divider, dot, error], hasDivider: true, icon: null },
    { mods: [dot, error], hasDivider: false, icon: null },
    { mods: [dot, noDescription, error], hasDivider: false, icon: null },
  ],
  // Legacy quirk: the waiting dot entries DO carry small icons (completed/error dots have none).
  waiting: [
    { mods: [divider, waiting], hasDivider: true, icon: PENDING },
    { mods: [waiting], hasDivider: false, icon: PENDING },
    { mods: [divider, small, waiting], hasDivider: true, icon: PENDING_SMALL },
    { mods: [small, waiting], hasDivider: false, icon: PENDING_SMALL },
    { mods: [small, waiting, noDescription], hasDivider: false, icon: PENDING_SMALL },
    { mods: [divider, dot, waiting], hasDivider: true, icon: PENDING_SMALL },
    { mods: [dot, waiting], hasDivider: false, icon: PENDING_SMALL },
    { mods: [dot, noDescription, waiting], hasDivider: false, icon: PENDING_SMALL },
  ],
};

const VERTICAL_DEFAULT = [
  { mods: [divider, vertical], hasDivider: true },
  { mods: [divider, vertical, noDescription], hasDivider: true },
  { mods: [vertical], hasDivider: false },
  { mods: [vertical, noDescription], hasDivider: false },
];

// Entry 1 duplicates entry 0's classes but has no description class (no footer rendered).
const VERTICAL_SMALL = [
  { mods: [divider, small, vertical], hasDivider: true, hasDescription: true },
  { mods: [divider, small, vertical], hasDivider: true, hasDescription: false },
  { mods: [small, vertical], hasDivider: false, hasDescription: true },
  { mods: [small, noDescription, vertical], hasDivider: false, hasDescription: true },
];

const VERTICAL_STATES = {
  completed: [
    { mods: [divider, complete, vertical], hasDivider: true, icon: CHECK },
    { mods: [divider, complete, vertical, noDescription], hasDivider: true, icon: CHECK },
    { mods: [complete, vertical], hasDivider: false, icon: CHECK },
    { mods: [complete, vertical, noDescription], hasDivider: false, icon: CHECK },
    { mods: [divider, complete, vertical, small], hasDivider: true, icon: CHECK_SMALL },
    { mods: [divider, complete, vertical, small, noDescription], hasDivider: true, icon: CHECK_SMALL },
    { mods: [complete, vertical, small], hasDivider: true, icon: CHECK_SMALL },
    { mods: [complete, vertical, small, noDescription], hasDivider: true, icon: CHECK_SMALL },
  ],
  error: [
    { mods: [divider, error, vertical], hasDivider: true, icon: CLOSE },
    { mods: [divider, error, vertical, noDescription], hasDivider: true, icon: CLOSE },
    { mods: [error, vertical], hasDivider: false, icon: CLOSE },
    { mods: [error, vertical, noDescription], hasDivider: false, icon: CLOSE },
    { mods: [divider, error, vertical, small], hasDivider: true, icon: CLOSE_SMALL },
    { mods: [divider, error, vertical, small, noDescription], hasDivider: true, icon: CLOSE_SMALL },
    { mods: [error, vertical, small], hasDivider: true, icon: CLOSE_SMALL },
    { mods: [error, vertical, small, noDescription], hasDivider: true, icon: CLOSE_SMALL },
  ],
  waiting: [
    { mods: [divider, waiting, vertical], hasDivider: true, icon: PENDING },
    { mods: [divider, waiting, vertical, noDescription], hasDivider: true, icon: PENDING },
    { mods: [waiting, vertical], hasDivider: false, icon: PENDING },
    { mods: [waiting, vertical, noDescription], hasDivider: false, icon: PENDING },
    { mods: [divider, waiting, vertical, small], hasDivider: true, icon: PENDING_SMALL },
    { mods: [divider, waiting, vertical, small, noDescription], hasDivider: true, icon: PENDING_SMALL },
    { mods: [waiting, vertical, small], hasDivider: true, icon: PENDING_SMALL },
    { mods: [waiting, vertical, small, noDescription], hasDivider: true, icon: PENDING_SMALL },
  ],
};

// The 66 examples in legacy template order. `vertical`/`verticalStates` place the divider on
// side; the horizontal branches place it in main. Titles: static "In Progress" for the non-state
// branches, labels.title (Completed/Error/Waiting) for the state branches.
const EXAMPLES = [
  ...DEFAULT.map((entry) => ({ branch: "default", entry, title: "In Progress" })),
  ...SMALL.map((entry) => ({ branch: "small", entry, title: "In Progress" })),
  ...DOT.map((entry) => ({ branch: "dot", entry, title: "In Progress" })),
  ...STATES.completed.map((entry) => ({ branch: "states", entry, title: "Completed" })),
  ...STATES.error.map((entry) => ({ branch: "states", entry, title: "Error" })),
  ...STATES.waiting.map((entry) => ({ branch: "states", entry, title: "Waiting" })),
  ...VERTICAL_DEFAULT.map((entry) => ({ branch: "vertical", entry, title: "In Progress" })),
  ...VERTICAL_SMALL.map((entry, index) => ({
    branch: "vertical",
    entry,
    title: "In Progress",
    // Entry 1 is the only case where two examples share the same step classes; the extra label
    // keeps the auto-style case names unique and describes the missing description.
    labelExtra: index === 1 ? ["no-description"] : undefined,
  })),
  ...VERTICAL_STATES.completed.map((entry) => ({ branch: "verticalStates", entry, title: "Completed" })),
  ...VERTICAL_STATES.error.map((entry) => ({ branch: "verticalStates", entry, title: "Error" })),
  ...VERTICAL_STATES.waiting.map((entry) => ({ branch: "verticalStates", entry, title: "Waiting" })),
];

const referenceNode = () => ({
  tag: "span",
  classNames: ["hggs-step-reference"],
  labels: ["2"],
  next: null,
});

const iconNode = (icon) => ({
  tag: "span",
  // Classless span (dot-state entries): labels [""] keeps it in the tree without adding text.
  classNames: icon ? [icon] : null,
  labels: icon ? null : [""],
  next: null,
});

const buildNode = ({ branch, entry, title }) => {
  const isVertical = branch === "vertical" || branch === "verticalStates";
  const isStates = branch === "states" || branch === "verticalStates";
  // The default branch is div-based; every other branch uses article/section/footer.
  const [rootTag, bodyTag, mainTag, descriptionTag] =
    branch === "default" ? ["div", "div", "div", "div"] : ["article", "section", "section", "footer"];

  const signalChildren = branch === "dot" ? [] : isStates ? [iconNode(entry.icon)] : [referenceNode()];

  const sideChildren = [{ tag: "div", classNames: ["hggs-step-signal"], labels: null, next: signalChildren }];

  if (isVertical && entry.hasDivider) {
    sideChildren.push({ tag: "span", classNames: ["hggs-step-divider"], labels: null, next: null });
  }

  const mainChildren = [{ tag: "span", classNames: ["hggs-step-title"], labels: [title], next: null }];

  if (!isVertical && entry.hasDivider) {
    mainChildren.push({ tag: "span", classNames: ["hggs-step-divider"], labels: null, next: null });
  }

  const bodyChildren = [{ tag: mainTag, classNames: ["hggs-step-main"], labels: null, next: mainChildren }];

  if (entry.hasDescription ?? true) {
    bodyChildren.push({
      tag: descriptionTag,
      classNames: ["hggs-step-description"],
      labels: ["This is a description"],
      next: null,
    });
  }

  return {
    tag: rootTag,
    classNames: [["hggs-step", ...entry.mods].join(" ")],
    labels: null,
    next: [
      { tag: "div", classNames: ["hggs-step-side"], labels: null, next: sideChildren },
      { tag: bodyTag, classNames: ["hggs-step-body"], labels: null, next: bodyChildren },
    ],
  };
};

const stepModel = {
  title: "Step",
  // Auto labels would collide on the two identical vertical small entries, so cases are explicit.
  cases: EXAMPLES.map(({ entry, labelExtra }) =>
    ["Step", ...entry.mods.map((mod) => mod.replace("hggs-step--", "")), ...(labelExtra ?? [])].join(" "),
  ),
  nodes: EXAMPLES.map(buildNode),
};

export default stepModel;
