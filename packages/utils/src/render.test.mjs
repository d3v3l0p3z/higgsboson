import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";

import { JSDOM } from "jsdom";

import { getDescriptions } from "./render.mjs";
import render from "./render.mjs";

test("LOGS_WARNINGS_ACTIVE is false when process is undefined (browser-safe)", () => {
  const result = vm.runInNewContext(
    "typeof process !== 'undefined' && process.env?.LOGS_WARNINGS_ACTIVE === 'true'",
    {},
    { timeout: 100 },
  );
  assert.strictEqual(result, false, "expression is false when process is undefined so no ReferenceError in browser");
});

test("divider-style model: getDescriptions preserves sibling order and no duplicate ids", async (t) => {
  await t.test("three siblings (p, div, p) with single class/label return in order and parent.next matches", () => {
    const dividerStyleModel = {
      nodes: [
        {
          tag: "div",
          classNames: ["hggs-container"],
          labels: null,
          next: [
            { tag: "p", classNames: ["hggs-text"], labels: ["First paragraph"], next: null },
            { tag: "div", classNames: ["hggs-divider"], labels: null, next: null },
            { tag: "p", classNames: ["hggs-text"], labels: ["Second paragraph"], next: null },
          ],
        },
      ],
    };

    const descriptions = getDescriptions(dividerStyleModel.nodes);

    const ids = descriptions.map((d) => d.id);
    const uniqueIds = new Set(ids);
    assert.strictEqual(ids.length, uniqueIds.size, "no duplicate description ids (single-label path must not push twice)");

    const container = descriptions.find((d) => d.value.className === "hggs-container");
    assert.ok(container, "container description exists");
    assert.ok(Array.isArray(container.next) && container.next.length === 3, "container has three children in next");

    const childDescriptions = container.next.map((id) => descriptions.find((d) => d.id === id));
    const tagOrder = childDescriptions.map((d) => d?.value?.tag);
    assert.deepStrictEqual(tagOrder, ["p", "div", "p"], "sibling order is p, div, p");
  });
});

test("has only classNames", async (t) => {
  await t.test("should describe one node if has one className", () => {
    const model = {
      title: "List",
      nodes: [
        {
          tag: "ta",
          classNames: ["ca"],
        },
      ],
    };

    const description = getDescriptions(model.nodes);

    assert.deepStrictEqual(description, [
      {
        id: "edge-0 --> tag-ta --> class-ca-0",
        value: {
          tag: "ta",
          className: "ca",
          label: null,
          attributes: null,
        },
        prev: null,
        next: null,
      },
    ]);
  });

  await t.test("should describe 'n' edges and 'n' nodes if has n classNames", () => {
    const model = {
      title: "List",
      nodes: [
        {
          tag: "ta",
          classNames: ["ca", "cb"],
        },
      ],
    };

    const description = getDescriptions(model.nodes);

    // Root node with multiple classNames uses same edge (nodeIndex 0) and class index 0,1,...
    assert.deepStrictEqual(description, [
      {
        id: "edge-0 --> tag-ta --> class-ca-0",
        value: {
          tag: "ta",
          className: "ca",
          label: null,
          attributes: null,
        },
        prev: null,
        next: null,
      },
      {
        id: "edge-0 --> tag-ta --> class-cb-1",
        value: {
          tag: "ta",
          className: "cb",
          label: null,
          attributes: null,
        },
        prev: null,
        next: null,
      },
    ]);
  });

  await t.test("should describe 'n' nodes right pointed prev and next if has n next nodes with classNames", () => {
    const model = {
      title: "List",
      nodes: [
        {
          tag: "ta",
          classNames: ["ca"],
          next: [
            {
              tag: "tb",
              classNames: ["cb"],
            },
          ],
        },
      ],
    };

    const description = getDescriptions(model.nodes);

    assert.deepStrictEqual(description, [
      {
        id: "edge-0 --> tag-ta --> class-ca-0",
        value: {
          tag: "ta",
          className: "ca",
          label: null,
          attributes: null,
        },
        prev: null,
        next: ["edge-0 --> tag-ta --> class-ca-0 --> tag-tb --> class-cb-0"],
      },
      {
        id: "edge-0 --> tag-ta --> class-ca-0 --> tag-tb --> class-cb-0",
        value: {
          tag: "tb",
          className: "cb",
          label: null,
          attributes: null,
        },
        prev: "edge-0 --> tag-ta --> class-ca-0",
        next: null,
      },
    ]);
  });

  await t.test(
    "should return 'n' edges and 'n' nodes right pointed if has 'n' classNames pointed prev and next if has 'n' next nodes with 'n' classNames",
    () => {
      const model = {
        title: "List",
        nodes: [
          {
            tag: "ta",
            classNames: ["ca", "cb"],
            next: [
              {
                tag: "tb",
                classNames: ["cc", "cd"],
              },
            ],
          },
        ],
      };

      const description = getDescriptions(model.nodes);

      assert.deepStrictEqual(description, [
        {
          id: "edge-0 --> tag-ta --> class-ca-0",
          value: {
            tag: "ta",
            className: "ca",
            label: null,
            attributes: null,
          },
          prev: null,
          next: [
            "edge-2 --> tag-ta --> class-ca-0 --> tag-tb --> class-cc-0",
            "edge-3 --> tag-ta --> class-ca-0 --> tag-tb --> class-cd-1",
          ],
        },
        {
          id: "edge-0 --> tag-ta --> class-cb-1",
          value: {
            tag: "ta",
            className: "cb",
            label: null,
            attributes: null,
          },
          prev: null,
          next: [
            "edge-4 --> tag-ta --> class-cb-1 --> tag-tb --> class-cc-0",
            "edge-5 --> tag-ta --> class-cb-1 --> tag-tb --> class-cd-1",
          ],
        },
        {
          id: "edge-2 --> tag-ta --> class-ca-0 --> tag-tb --> class-cc-0",
          value: {
            tag: "tb",
            className: "cc",
            label: null,
            attributes: null,
          },
          prev: "edge-0 --> tag-ta --> class-ca-0",
          next: null,
        },
        {
          id: "edge-3 --> tag-ta --> class-ca-0 --> tag-tb --> class-cd-1",
          value: {
            tag: "tb",
            className: "cd",
            label: null,
            attributes: null,
          },
          prev: "edge-0 --> tag-ta --> class-ca-0",
          next: null,
        },
        {
          id: "edge-4 --> tag-ta --> class-cb-1 --> tag-tb --> class-cc-0",
          value: {
            tag: "tb",
            className: "cc",
            label: null,
            attributes: null,
          },
          prev: "edge-0 --> tag-ta --> class-cb-1",
          next: null,
        },
        {
          id: "edge-5 --> tag-ta --> class-cb-1 --> tag-tb --> class-cd-1",
          value: {
            tag: "tb",
            className: "cd",
            label: null,
            attributes: null,
          },
          prev: "edge-0 --> tag-ta --> class-cb-1",
          next: null,
        },
      ]);
    },
  );
});

test("has only labels", async (t) => {
  await t.test("should describe one node if has 1 label", () => {
    const model = {
      title: "List",
      nodes: [
        {
          tag: "ta",
          labels: ["la"],
        },
      ],
    };

    const description = getDescriptions(model.nodes);

    assert.deepStrictEqual(description, [
      {
        id: "edge-0 --> tag-ta --> label-la-0",
        value: {
          tag: "ta",
          className: null,
          label: "la",
          attributes: null,
        },
        prev: null,
        next: null,
      },
    ]);
  });

  await t.test("should describe n nodes if has n labels", () => {
    const model = {
      title: "List",
      nodes: [
        {
          tag: "ta",
          labels: ["la", "lb"],
        },
      ],
    };

    const description = getDescriptions(model.nodes);

    assert.deepStrictEqual(description, [
      {
        id: "edge-0 --> tag-ta --> label-la-0",
        value: {
          tag: "ta",
          label: "la",
          className: null,
          attributes: null,
        },
        prev: null,
        next: null,
      },
      {
        id: "edge-1 --> tag-ta --> label-lb-1",
        value: {
          tag: "ta",
          label: "lb",
          className: null,
          attributes: null,
        },
        prev: null,
        next: null,
      },
    ]);
  });

  await t.test("should return n nodes right pointed prev and next if has n next nodes with labels", () => {
    const model = {
      title: "List",
      nodes: [
        {
          tag: "ta",
          labels: ["la"],
          next: [
            {
              tag: "tb",
              labels: ["lb"],
            },
          ],
        },
      ],
    };

    const description = getDescriptions(model.nodes);

    assert.deepStrictEqual(description, [
      {
        id: "edge-0 --> tag-ta --> label-la-0",
        value: {
          tag: "ta",
          label: "la",
          className: null,
          attributes: null,
        },
        prev: null,
        next: ["edge-0 --> tag-ta --> label-la-0 --> tag-tb --> label-lb-0"],
      },
      {
        id: "edge-0 --> tag-ta --> label-la-0 --> tag-tb --> label-lb-0",
        value: {
          tag: "tb",
          className: null,
          label: "lb",
          attributes: null,
        },
        prev: "edge-0 --> tag-ta --> label-la-0",
        next: null,
      },
    ]);
  });

  await t.test("should return n nodes right pointed if has n labels pointed prev and next if has n next nodes", () => {
    const model = {
      title: "List",
      nodes: [
        {
          tag: "ta",
          labels: ["la", "lb"],
          next: [
            {
              tag: "tb",
              labels: ["lc", "ld"],
            },
          ],
        },
      ],
    };

    const description = getDescriptions(model.nodes);

    assert.deepStrictEqual(description, [
      {
        id: "edge-0 --> tag-ta --> label-la-0",
        value: {
          tag: "ta",
          className: null,
          label: "la",
          attributes: null,
        },
        prev: null,
        next: [
          "edge-0 --> tag-ta --> label-la-0 --> tag-tb --> label-lc-0",
          "edge-1 --> tag-ta --> label-la-0 --> tag-tb --> label-ld-1",
        ],
      },
      {
        id: "edge-1 --> tag-ta --> label-lb-1",
        value: {
          tag: "ta",
          className: null,
          label: "lb",
          attributes: null,
        },
        prev: null,
        next: [
          "edge-1 --> tag-ta --> label-lb-1 --> tag-tb --> label-lc-0",
          "edge-2 --> tag-ta --> label-lb-1 --> tag-tb --> label-ld-1",
        ],
      },
      {
        id: "edge-0 --> tag-ta --> label-la-0 --> tag-tb --> label-lc-0",
        value: {
          tag: "tb",
          className: null,
          label: "lc",
          attributes: null,
        },
        prev: "edge-0 --> tag-ta --> label-la-0",
        next: null,
      },
      {
        id: "edge-1 --> tag-ta --> label-la-0 --> tag-tb --> label-ld-1",
        value: {
          tag: "tb",
          className: null,
          label: "ld",
          attributes: null,
        },
        prev: "edge-0 --> tag-ta --> label-la-0",
        next: null,
      },
      {
        id: "edge-1 --> tag-ta --> label-lb-1 --> tag-tb --> label-lc-0",
        value: {
          tag: "tb",
          className: null,
          label: "lc",
          attributes: null,
        },
        prev: "edge-1 --> tag-ta --> label-lb-1",
        next: null,
      },
      {
        id: "edge-2 --> tag-ta --> label-lb-1 --> tag-tb --> label-ld-1",
        value: {
          tag: "tb",
          className: null,
          label: "ld",
          attributes: null,
        },
        prev: "edge-1 --> tag-ta --> label-lb-1",
        next: null,
      },
    ]);
  });
});

test("single parent with next that has multiple classNames (list-like)", async (t) => {
  await t.test("should replicate parent per child class and attach each branch of children to its parent", () => {
    const model = {
      nodes: [
        {
          tag: "ul",
          classNames: ["hggs-list"],
          next: [
            {
              tag: "li",
              classNames: ["hggs-list-item", "hggs-list-item hggs-list--marker"],
              labels: ["First item.", "Second item.", "Third item."],
              next: null,
            },
          ],
        },
      ],
    };

    const description = getDescriptions(model.nodes);

    assert.strictEqual(description.length, 2 + 6);
    const uls = description.filter((d) => d.value.tag === "ul");
    const lis = description.filter((d) => d.value.tag === "li");
    assert.strictEqual(uls.length, 2);
    assert.strictEqual(lis.length, 6);
    assert.strictEqual(uls[0].next?.length, 3);
    assert.strictEqual(uls[1].next?.length, 3);
    const firstUlLis = lis.filter((li) => li.prev === uls[0].id);
    const secondUlLis = lis.filter((li) => li.prev === uls[1].id);
    assert.strictEqual(firstUlLis.length, 3);
    assert.strictEqual(secondUlLis.length, 3);
    assert.strictEqual(firstUlLis[0].value.className, "hggs-list-item");
    assert.strictEqual(secondUlLis[0].value.className, "hggs-list-item hggs-list--marker");
    // Ids must not contain spaces (class name in id is hyphenated)
    assert.ok(
      secondUlLis[0].id.includes("class-hggs-list-item-hggs-list--marker-0"),
      "multi-word class in id must be hyphenated",
    );
  });
});

test("list model produces output matching help.html structure", async (t) => {
  const listModel = {
    title: "List",
    nodes: [
      {
        tag: "ul",
        classNames: ["hggs-list"],
        labels: null,
        next: [
          {
            tag: "li",
            classNames: ["hggs-list-item", "hggs-list-item hggs-list--marker"],
            labels: [
              "First item on the list.",
              "Second item on the list.",
              "Third term on the list.",
              "Fourth term on the list.",
              "Five term on the list.",
              "Sixth term on the list.",
              "Seventh term on the list.",
            ],
            next: null,
          },
        ],
      },
    ],
  };

  await t.test("two uls (same edge-0, class index 0 and 1), children match help.html", () => {
    const description = getDescriptions(listModel.nodes);

    const uls = description.filter((d) => d.value.tag === "ul");
    const lis = description.filter((d) => d.value.tag === "li");

    assert.strictEqual(uls.length, 2, "expect 2 ul (one per child class variant)");
    assert.strictEqual(lis.length, 14, "expect 7 + 7 li (all labels per variant)");

    // Definitive output: both uls use edge-0, distinguished by class index (0 vs 1)
    assert.strictEqual(uls[0].id, "edge-0 --> tag-ul --> class-hggs-list-0");
    assert.strictEqual(uls[1].id, "edge-0 --> tag-ul --> class-hggs-list-1");

    const firstUlLis = lis.filter((li) => li.prev === uls[0].id);
    const secondUlLis = lis.filter((li) => li.prev === uls[1].id);
    assert.strictEqual(firstUlLis.length, 7);
    assert.strictEqual(secondUlLis.length, 7);

    assert.strictEqual(firstUlLis[0].value.className, "hggs-list-item");
    assert.strictEqual(firstUlLis[0].value.label, "First item on the list.");
    assert.ok(
      firstUlLis[0].id.includes("class-hggs-list-item-0"),
      "first variant class in id",
    );
    assert.ok(
      firstUlLis[0].id.includes("label-first-item-on-the-list-0"),
      "kebab label in id",
    );

    assert.strictEqual(secondUlLis[0].value.className, "hggs-list-item hggs-list--marker");
    assert.ok(
      secondUlLis[0].id.includes("class-hggs-list-item-hggs-list--marker-0"),
      "second variant: multi-word class in id must be hyphenated (no spaces)",
    );
    // Second ul's children all start with parent id (edge-0 --> ... class-hggs-list-1)
    assert.ok(
      secondUlLis[0].id.startsWith("edge-0 --> tag-ul --> class-hggs-list-1 --> tag-li"),
      "child id starts with parent id (same edge-0 for second ul)",
    );
    assert.ok(
      secondUlLis.every((li) => li.id.startsWith("edge-0 --> tag-ul --> class-hggs-list-1 --> tag-li")),
      "all second ul children use edge-0",
    );
  });
});

test("box model produces output matching help.html structure", async (t) => {
  const boxModel = {
    title: "Box",
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
                labels: ["Chanante ipsum dolor sit amet..."],
                next: null,
              },
            ],
          },
        ],
      },
    ],
  };

  await t.test("first 4 divs edge-0 class index 0..3, next 4 divs edge-1 class index 0..3 with children", () => {
    const description = getDescriptions(boxModel.nodes);

    const divs = description.filter((d) => d.value.tag === "div");
    assert.strictEqual(divs.length, 8, "expect 8 root-level divs (4 + 4)");

    // First root node: same edge-0, class index 0,1,2,3 (help.html lines 54-71)
    assert.strictEqual(divs[0].id, "edge-0 --> tag-div --> class-hggs-box-0");
    assert.strictEqual(divs[1].id, "edge-0 --> tag-div --> class-hggs-box-hggs-box--rounded-1");
    assert.strictEqual(divs[2].id, "edge-0 --> tag-div --> class-hggs-box-hggs-box--primary-2");
    assert.strictEqual(
      divs[3].id,
      "edge-0 --> tag-div --> class-hggs-box-hggs-box--primary-hggs-box--rounded-3",
    );

    // Second root node: same edge-1, class index 0,1,2,3 (help.html lines 72-170)
    assert.strictEqual(divs[4].id, "edge-1 --> tag-div --> class-hggs-box-0");
    assert.strictEqual(divs[5].id, "edge-1 --> tag-div --> class-hggs-box-hggs-box--rounded-1");
    assert.strictEqual(divs[6].id, "edge-1 --> tag-div --> class-hggs-box-hggs-box--primary-2");
    assert.strictEqual(
      divs[7].id,
      "edge-1 --> tag-div --> class-hggs-box-hggs-box--primary-hggs-box--rounded-3",
    );

    // Second node's divs have next (header, section with h4 and p)
    const divsWithNext = divs.filter((d) => d.next?.length);
    assert.strictEqual(divsWithNext.length, 4, "second 4 divs have children");
    assert.ok(
      divs[4].next?.some((id) => id.includes("tag-header")),
      "first box with children has header",
    );

    // help.html: one h4 and one p per box with children (no duplicate h4/p)
    const h4s = description.filter((d) => d.value.tag === "h4");
    const ps = description.filter((d) => d.value.tag === "p");
    assert.strictEqual(h4s.length, 4, "exactly 4 h4 (one per box with children)");
    assert.strictEqual(ps.length, 4, "exactly 4 p (one per box with children)");
    const ids = description.map((d) => d.id);
    assert.strictEqual(ids.length, new Set(ids).size, "all description ids are unique");
  });
});

test("checkbox model produces output matching help.html structure", async (t) => {
  const checkboxModel = {
    title: "Checkbox",
    nodes: [
      {
        tag: "div",
        classNames: ["hggs-checkbox"],
        labels: null,
        next: [
          {
            tag: "input",
            classNames: ["hggs-checkbox-input"],
            attributes: { name: "checkbox", type: "checkbox" },
            labels: null,
            next: null,
          },
          {
            tag: "label",
            classNames: ["hggs-checkbox-label"],
            labels: ["Option 1"],
            next: null,
          },
        ],
      },
      {
        tag: "div",
        classNames: ["hggs-checkboxes"],
        labels: null,
        next: [
          {
            tag: "div",
            classNames: ["hggs-checkbox"],
            labels: null,
            next: [
              {
                tag: "input",
                classNames: ["hggs-checkbox-input"],
                attributes: { name: "checkbox", type: "checkbox" },
                labels: null,
                next: null,
              },
              {
                tag: "label",
                classNames: ["hggs-checkbox-label"],
                labels: ["Option 1", "Option 2", "Option 3"],
                next: null,
              },
            ],
          },
        ],
      },
    ],
  };

  await t.test("first root single checkbox (edge-0), second root checkboxes container with inner div (class index 1) and 3 input+label pairs", () => {
    const description = getDescriptions(checkboxModel.nodes);

    // First root (edge-0): one div with input (name=checkbox-0, type=checkbox) and label (for=input id, Option 1) per help.html
    const rootDivs = description.filter((d) => d.value.tag === "div" && !d.prev);
    assert.strictEqual(rootDivs.length, 2);
    assert.strictEqual(rootDivs[0].id, "edge-0 --> tag-div --> class-hggs-checkbox-0");
    assert.strictEqual(rootDivs[1].id, "edge-1 --> tag-div --> class-hggs-checkboxes-0");

    const inputEdge0 = description.find(
      (d) => d.value.tag === "input" && d.id.startsWith("edge-0"),
    );
    const labelEdge0 = description.find(
      (d) => d.value.tag === "label" && d.id.startsWith("edge-0"),
    );
    assert.ok(inputEdge0, "edge-0 has input");
    assert.ok(labelEdge0, "edge-0 has label");
    assert.strictEqual(inputEdge0.value.attributes?.name, "checkbox-0");
    assert.strictEqual(inputEdge0.value.attributes?.type, "checkbox");
    assert.strictEqual(labelEdge0.value.attributes?.for, inputEdge0.id);
    assert.strictEqual(labelEdge0.value.label, "Option 1");

    // Inner div under checkboxes has class index 1 (help.html line 162)
    const innerDiv = description.find(
      (d) =>
        d.value.tag === "div" &&
        d.prev &&
        d.id.includes("hggs-checkboxes-0") &&
        d.id.includes("class-hggs-checkbox-1"),
    );
    assert.ok(innerDiv, "inner div has id ending class-hggs-checkbox-1");

    // Second root: 3 inputs and 3 labels under the inner div, with for and name attributes
    const inputs = description.filter((d) => d.value.tag === "input");
    assert.strictEqual(inputs.length, 4, "1 from first root + 3 from second root");
    const inputsEdge1 = inputs.filter((d) => d.id.startsWith("edge-1"));
    assert.strictEqual(inputsEdge1.length, 3);
    assert.ok(
      inputsEdge1.every((d) => d.prev === innerDiv.id),
      "all 3 inputs have prev = inner div id",
    );
    assert.ok(
      inputsEdge1.every((d) => d.value.className === "hggs-checkbox-input"),
      "all checkbox inputs have class hggs-checkbox-input (no -0/-1/-2 suffix per help.html)",
    );
    assert.deepStrictEqual(
      inputsEdge1.map((d) => d.value.attributes?.name).sort(),
      ["checkbox-0", "checkbox-1", "checkbox-2"],
    );

    const labels = description.filter((d) => d.value.tag === "label");
    const labelsEdge1 = labels.filter((d) => d.id.startsWith("edge-1"));
    assert.strictEqual(labelsEdge1.length, 3);
    assert.ok(
      labelsEdge1.every((d) => d.value.attributes?.for),
      "each label has for attribute",
    );
    const inputIds = new Set(inputsEdge1.map((d) => d.id));
    assert.ok(
      labelsEdge1.every((d) => inputIds.has(d.value.attributes.for)),
      "each label for points to an input id",
    );
  });
});

test("dialog model produces output matching help.html structure", async (t) => {
  const dialogModel = {
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
                    attributes: [{ command: "close-modal", commandfor: "hggs-dialog-id" }],
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
                      "Chanante ipsum dolor sit amet, eiusmod eres un pirámidee mangurrián magna veniam magna exercitation asobinao.",
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
                        attributes: [{ command: "close-modal", commandfor: "hggs-dialog-id" }],
                        classNames: ["hggs-button hggs-button--primary hggs-button--big"],
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
            attributes: [{ command: "show-modal", commandfor: "hggs-dialog-id" }],
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

  await t.test("one container with three (dialog + trigger button) pairs as direct children", () => {
    const description = getDescriptions(dialogModel.nodes);

    const roots = description.filter((d) => !d.prev);
    assert.strictEqual(roots.length, 1, "expect single root container (help.html 199-328)");
    const container = roots[0];
    assert.strictEqual(container.value.tag, "div");
    assert.strictEqual(container.value.className, "hggs-container");
    assert.ok(container.id.endsWith("class-hggs-container-0"), "container id uses class index 0 (help.html 199)");

    const triggerLabels = ["Big", "Medium", "Small"];
    const dialogs = description.filter((d) => d.value.tag === "dialog");
    const triggerButtons = description.filter(
      (d) => d.value.tag === "button" && d.value.label && triggerLabels.includes(d.value.label),
    );

    assert.strictEqual(dialogs.length, 3, "expect 3 dialogs (big, medium, small)");
    assert.strictEqual(triggerButtons.length, 3, "expect 3 trigger buttons");
    assert.ok(
      triggerButtons.every((b) => b.prev === container.id),
      "all trigger buttons are direct children of container",
    );
    assert.ok(
      dialogs.every((d) => d.prev === container.id),
      "all dialogs are direct children of container",
    );

    const directChildren = description.filter((d) => d.prev === container.id);
    assert.strictEqual(directChildren.length, 6, "expect 6 direct children (3 dialog + 3 trigger button)");

    assert.deepStrictEqual(
      dialogs.map((d) => d.value.className).sort(),
      [
        "hggs-dialog hggs-dialog--big",
        "hggs-dialog hggs-dialog--medium",
        "hggs-dialog hggs-dialog--small",
      ].sort(),
      "dialog classNames match big, medium, small",
    );
    assert.deepStrictEqual(
      triggerButtons.map((d) => d.value.label).sort(),
      triggerLabels.slice().sort(),
      "trigger button labels match",
    );
    const expectedTriggerClasses = [
      "hggs-button hggs-button--primary hggs-button--big",
      "hggs-button hggs-button--primary hggs-button--medium",
      "hggs-button hggs-button--primary hggs-button--small",
    ];
    assert.deepStrictEqual(
      triggerButtons.map((d) => d.value.className).sort(),
      expectedTriggerClasses.slice().sort(),
      "trigger button classes match help.html (one per iteration)",
    );

    for (const dialog of dialogs) {
      const dialogChildren = description.filter((d) => d.prev === dialog.id);
      const tags = dialogChildren.map((d) => d.value.tag);
      assert.ok(tags.includes("header"), "each dialog has header");
      assert.ok(tags.includes("section"), "each dialog has section");
      assert.ok(tags.includes("footer"), "each dialog has footer");
    }

    assert.strictEqual(container.next?.length, 6, "container next lists all 6 direct children");
    const ids = description.map((d) => d.id);
    assert.strictEqual(ids.length, new Set(ids).size, "all description ids are unique");
  });

  await t.test("close and OK buttons have command and commandfor attributes", () => {
    const description = getDescriptions(dialogModel.nodes);
    const flattenAttrs = (attrs) =>
      attrs == null ? {} : Array.isArray(attrs) ? Object.assign({}, ...attrs) : { ...attrs };

    const allButtons = description.filter((d) => d.value.tag === "button");
    const closeButtons = description.filter(
      (d) => d.value.tag === "button" && d.value.className?.includes("hggs-dialog-close"),
    );
    const okButtons = description.filter(
      (d) => d.value.tag === "button" && d.value.label === "Ok",
    );

    assert.strictEqual(
      allButtons.length,
      9,
      `expect 9 buttons (3 trigger + 3 close + 3 OK), got ${allButtons.length}. ClassNames: ${allButtons.map((b) => b.value.className).join(" | ")}`,
    );
    assert.strictEqual(closeButtons.length, 3, `expect 3 close buttons (one per dialog), got ${closeButtons.length}`);
    assert.strictEqual(okButtons.length, 3, "expect 3 OK buttons (one per dialog)");

    // Dialogs have id = model id + sibling index (help.html: hggs-dialog-id-0, hggs-dialog-id-1, hggs-dialog-id-2)
    const dialogs = description.filter((d) => d.value.tag === "dialog");
    const expectedDialogIds = ["hggs-dialog-id-0", "hggs-dialog-id-1", "hggs-dialog-id-2"];
    assert.deepStrictEqual(
      dialogs.map((d) => d.value.id).sort(),
      expectedDialogIds.slice().sort(),
      "dialog ids are model id + sibling index",
    );

    // Close and OK buttons: commandfor points to their dialog (suffixed id). Sort by commandfor for deterministic order.
    const closeByCommandFor = closeButtons.slice().sort((a, b) => {
      const af = flattenAttrs(a.value.attributes).commandfor ?? "";
      const bf = flattenAttrs(b.value.attributes).commandfor ?? "";
      return af.localeCompare(bf);
    });
    for (let idx = 0; idx < closeByCommandFor.length; idx++) {
      const attrs = flattenAttrs(closeByCommandFor[idx].value.attributes);
      assert.strictEqual(attrs.command, "close-modal", "close button has command");
      assert.strictEqual(attrs.commandfor, expectedDialogIds[idx], "close button commandfor matches dialog id");
    }
    const okByCommandFor = okButtons.slice().sort((a, b) => {
      const af = flattenAttrs(a.value.attributes).commandfor ?? "";
      const bf = flattenAttrs(b.value.attributes).commandfor ?? "";
      return af.localeCompare(bf);
    });
    for (let idx = 0; idx < okByCommandFor.length; idx++) {
      const attrs = flattenAttrs(okByCommandFor[idx].value.attributes);
      assert.strictEqual(attrs.command, "close-modal", "OK button has command");
      assert.strictEqual(attrs.commandfor, expectedDialogIds[idx], "OK button commandfor matches dialog id");
    }

    // Trigger buttons: commandfor points to their dialog (suffixed id)
    const triggerButtons = description.filter(
      (d) => d.value.tag === "button" && d.value.label && ["Big", "Medium", "Small"].includes(d.value.label),
    );
    const triggerByCommandFor = triggerButtons.slice().sort((a, b) => {
      const af = flattenAttrs(a.value.attributes).commandfor ?? "";
      const bf = flattenAttrs(b.value.attributes).commandfor ?? "";
      return af.localeCompare(bf);
    });
    for (let idx = 0; idx < triggerByCommandFor.length; idx++) {
      const attrs = flattenAttrs(triggerByCommandFor[idx].value.attributes);
      assert.strictEqual(attrs.command, "show-modal", "trigger has command");
      assert.strictEqual(attrs.commandfor, expectedDialogIds[idx], "trigger commandfor matches dialog id");
    }
  });
});

test("has labels and classNames", async (t) => {
  await t.test("should describe 2 node if has 1 child with 2 labels and 2 classNames", () => {
    const model = {
      title: "List",
      nodes: [
        {
          tag: "ta",
          classNames: ["ca"],
          next: [
            {
              tag: "tb",
              classNames: ["cb", "cc"],
              labels: ["la", "lb", "lc"],
            },
          ],
        },
      ],
    };

    const description = getDescriptions(model.nodes);

    assert.deepStrictEqual(description, [
      {
        id: "edge-0 --> tag-ta --> class-ca-0",
        value: {
          tag: "ta",
          className: "ca",
          label: null,
          attributes: null,
        },
        prev: null,
        next: [
          "edge-0 --> tag-ta --> class-ca-0 --> tag-tb --> class-cb-0 --> label-la-0",
          "edge-1 --> tag-ta --> class-ca-0 --> tag-tb --> class-cb-0 --> label-lb-1",
          "edge-2 --> tag-ta --> class-ca-0 --> tag-tb --> class-cb-0 --> label-lc-2",
        ],
      },
      {
        id: "edge-0 --> tag-ta --> class-ca-1",
        value: {
          tag: "ta",
          className: "ca",
          label: null,
          attributes: null,
        },
        prev: null,
        next: [
          "edge-0 --> tag-ta --> class-ca-1 --> tag-tb --> class-cc-0 --> label-la-0",
          "edge-0 --> tag-ta --> class-ca-1 --> tag-tb --> class-cc-1 --> label-lb-1",
          "edge-0 --> tag-ta --> class-ca-1 --> tag-tb --> class-cc-2 --> label-lc-2",
        ],
      },
      {
        id: "edge-0 --> tag-ta --> class-ca-0 --> tag-tb --> class-cb-0 --> label-la-0",
        value: {
          tag: "tb",
          className: "cb",
          label: "la",
          attributes: null,
        },
        prev: "edge-0 --> tag-ta --> class-ca-0",
        next: null,
      },
      {
        id: "edge-1 --> tag-ta --> class-ca-0 --> tag-tb --> class-cb-0 --> label-lb-1",
        value: {
          tag: "tb",
          className: "cb",
          label: "lb",
          attributes: null,
        },
        prev: "edge-0 --> tag-ta --> class-ca-0",
        next: null,
      },
      {
        id: "edge-2 --> tag-ta --> class-ca-0 --> tag-tb --> class-cb-0 --> label-lc-2",
        value: {
          tag: "tb",
          className: "cb",
          label: "lc",
          attributes: null,
        },
        prev: "edge-0 --> tag-ta --> class-ca-0",
        next: null,
      },
      {
        id: "edge-0 --> tag-ta --> class-ca-1 --> tag-tb --> class-cc-0 --> label-la-0",
        value: {
          tag: "tb",
          className: "cc",
          label: "la",
          attributes: null,
        },
        prev: "edge-0 --> tag-ta --> class-ca-1",
        next: null,
      },
      {
        id: "edge-0 --> tag-ta --> class-ca-1 --> tag-tb --> class-cc-1 --> label-lb-1",
        value: {
          tag: "tb",
          className: "cc",
          label: "lb",
          attributes: null,
        },
        prev: "edge-0 --> tag-ta --> class-ca-1",
        next: null,
      },
      {
        id: "edge-0 --> tag-ta --> class-ca-1 --> tag-tb --> class-cc-2 --> label-lc-2",
        value: {
          tag: "tb",
          className: "cc",
          label: "lc",
          attributes: null,
        },
        prev: "edge-0 --> tag-ta --> class-ca-1",
        next: null,
      },
    ]);
  });
});

test("render (getNode, appendNode, sortDescriptionsForAppend)", async (t) => {
  let dom;
  let prevDocument;

  const setupDom = (html = "<!DOCTYPE html><html><body><div id=\"hggs-root\"></div></body></html>") => {
    dom = new JSDOM(html, { url: "http://localhost" });
    prevDocument = globalThis.document;
    globalThis.document = dom.window.document;
  };

  const teardownDom = () => {
    if (prevDocument !== undefined) {
      globalThis.document = prevDocument;
    }
  };

  await t.test("render builds DOM from model (covers render, getNode, appendNode)", () => {
    setupDom();
    try {
      const model = {
        title: "Simple",
        nodes: [
          {
            tag: "div",
            classNames: ["hggs-box"],
            labels: null,
            next: null,
          },
        ],
      };
      render(model);
      const root = dom.window.document.getElementById("hggs-root");
      assert.ok(root, "root exists");
      assert.strictEqual(root.children.length, 1, "one child appended");
      const child = root.firstElementChild;
      assert.strictEqual(child.tagName.toLowerCase(), "div", "getNode creates correct tag");
      assert.ok(child.classList.contains("hggs-box"), "getNode sets class from description");
      assert.ok(child.id, "getNode sets id");
    } finally {
      teardownDom();
    }
  });

  await t.test("render uses rootNodeId when provided", () => {
    setupDom(
      "<!DOCTYPE html><html><body><div id=\"custom-root\"></div><div id=\"hggs-root\"></div></body></html>",
    );
    try {
      render(
        { nodes: [{ tag: "span", classNames: ["x"], labels: null, next: null }] },
        "custom-root",
      );
      const custom = dom.window.document.getElementById("custom-root");
      const defaultRoot = dom.window.document.getElementById("hggs-root");
      assert.strictEqual(custom.children.length, 1, "custom root has one child");
      assert.strictEqual(defaultRoot.children.length, 0, "default root unchanged");
      assert.strictEqual(custom.firstElementChild.tagName.toLowerCase(), "span", "child is span");
    } finally {
      teardownDom();
    }
  });

  await t.test("getNode sets attributes and textContent", () => {
    setupDom();
    try {
      const model = {
        nodes: [
          {
            tag: "button",
            classNames: ["btn"],
            labels: ["Click me"],
            attributes: [{ command: "submit", commandfor: "form-1" }],
            next: null,
          },
        ],
      };
      render(model);
      const root = dom.window.document.getElementById("hggs-root");
      const btn = root.firstElementChild;
      assert.strictEqual(btn.textContent, "Click me", "getNode sets textContent from label");
      assert.strictEqual(btn.getAttribute("command"), "submit", "getNode sets command attribute");
      assert.strictEqual(btn.getAttribute("commandfor"), "form-1", "getNode sets commandfor attribute");
    } finally {
      teardownDom();
    }
  });

  await t.test("sortDescriptionsForAppend: parent before children in DOM", () => {
    setupDom();
    try {
      const model = {
        nodes: [
          {
            tag: "div",
            classNames: ["parent"],
            labels: null,
            next: [
              {
                tag: "span",
                classNames: ["child"],
                labels: null,
                next: null,
              },
            ],
          },
        ],
      };
      render(model);
      const root = dom.window.document.getElementById("hggs-root");
      assert.strictEqual(root.children.length, 1, "one direct child (parent)");
      const parent = root.firstElementChild;
      assert.strictEqual(parent.tagName.toLowerCase(), "div", "first is parent div");
      assert.strictEqual(parent.children.length, 1, "parent has one child");
      assert.strictEqual(parent.firstElementChild.tagName.toLowerCase(), "span", "child is span");
    } finally {
      teardownDom();
    }
  });

  await t.test("render preserves sibling order (p, div, p) for divider-style model", () => {
    setupDom();
    try {
      const model = {
        nodes: [
          {
            tag: "div",
            classNames: ["hggs-container"],
            labels: null,
            next: [
              { tag: "p", classNames: ["hggs-text"], labels: ["First"], next: null },
              { tag: "div", classNames: ["hggs-divider"], labels: null, next: null },
              { tag: "p", classNames: ["hggs-text"], labels: ["Second"], next: null },
            ],
          },
        ],
      };
      render(model);
      const root = dom.window.document.getElementById("hggs-root");
      const container = root.firstElementChild;
      assert.ok(container, "container exists");
      assert.strictEqual(container.children.length, 3, "container has three children");
      assert.strictEqual(container.children[0].tagName.toLowerCase(), "p", "first child is p");
      assert.strictEqual(container.children[0].textContent, "First", "first p content");
      assert.strictEqual(container.children[1].tagName.toLowerCase(), "div", "second child is div");
      assert.ok(container.children[1].classList.contains("hggs-divider"), "div has hggs-divider class");
      assert.strictEqual(container.children[2].tagName.toLowerCase(), "p", "third child is p");
      assert.strictEqual(container.children[2].textContent, "Second", "second p content");
    } finally {
      teardownDom();
    }
  });

  await t.test("render does nothing when root not found", () => {
    setupDom("<!DOCTYPE html><html><body></body></html>");
    try {
      assert.doesNotThrow(() => {
        render({ nodes: [{ tag: "div", classNames: ["x"], labels: null, next: null }] });
      }, "no throw when root missing");
      assert.strictEqual(dom.window.document.body.children.length, 0, "body still empty");
    } finally {
      teardownDom();
    }
  });

  await t.test("render throws when no descriptions", () => {
    setupDom();
    try {
      assert.throws(
        () => render({ nodes: [] }),
        /No descriptions found to render/,
        "throws when nodes empty",
      );
      assert.throws(
        () => render({}),
        /No descriptions found to render/,
        "throws when no nodes",
      );
    } finally {
      teardownDom();
    }
  });

  await t.test("render with value.id uses model id on element", () => {
    setupDom();
    try {
      const model = {
        nodes: [
          {
            tag: "div",
            id: "my-custom-id",
            classNames: ["box"],
            labels: null,
            next: null,
          },
        ],
      };
      render(model);
      const root = dom.window.document.getElementById("hggs-root");
      const el = root.firstElementChild;
      assert.strictEqual(el.id, "my-custom-id", "getNode uses description.value.id when set");
    } finally {
      teardownDom();
    }
  });
});
