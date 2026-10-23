const TOOLTIP_DIRECTIONS = ["up", "right", "down", "left"];

const tooltipModel = {
  title: "Tooltip",
  nodes: TOOLTIP_DIRECTIONS.map((direction) => ({
    tag: "span",
    classNames: [`hggs-tooltip hggs-tooltip--${direction}`],
    labels: ["Hover me to see the tooltip"],
    attributes: { "data-tooltip": "I’m the tooltip text" },
    next: null,
  })),
};

export default tooltipModel;
