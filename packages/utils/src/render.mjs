import getInKebabCaseFormat from "./getInKebabCaseFormat.mjs";

const LOGS_WARNINGS_ACTIVE = typeof process !== "undefined" && process.env?.LOGS_WARNINGS_ACTIVE === "true";

/**
 * Get the description id.
 * @param {string} sourceId - The source id.
 * @param {number} numberOfCopy - The number of copy.
 * @param {number} numberOfEdge - The number of edge.
 * @returns {string} The description id.
 */
function getDescriptionId(sourceId, numberOfCopy, numberOfEdge) {
  return sourceId.replace(/edge-(\d+)/g, `edge-${numberOfCopy + numberOfEdge}`);
}

/**
 * Sanitize className for use in id attribute (no spaces).
 * @param {string} className - The className to sanitize.
 * @returns {string} The sanitized className.
 */
function classNameForId(className) {
  return className == null ? "" : String(className).trim().replace(/\s+/g, "-");
}

/**
 * Replace the last class index segment in an id (e.g. ... class-hggs-list--marker-0 → ...-1).
 * @param {string} id - The id to replace the class index segment.
 * @param {number} classIndex - The class index to replace.
 * @returns {string} The id with the replaced class index segment.
 */
function replaceClassIndexInId(id, classIndex) {
  return id.replace(/(.*--> class-.+?-)(\d+)$/, `$1${classIndex}`);
}

/**
 * Get the descriptions copies.
 * @param {object[]} objects - The objects to get the copies.
 * @param {number} numberOfCopies - The number of copies.
 * @param {number} numberOfEdge - The number of edge.
 * @returns {object[]} The descriptions copies.
 */
function getDescriptionsCopies(objects = [], numberOfCopies = 1, numberOfEdge = 0) {
  if (!Array.isArray(objects) || objects.length === 0) {
    return [];
  }

  const copies = [];

  for (let c = 0; c < numberOfCopies; c++) {
    for (const object of objects) {
      const shadowObject = structuredClone(object);

      // update id depending of number of copy and number of edge
      shadowObject.id = getDescriptionId(shadowObject.id, c, numberOfEdge);

      // add new updated object into copies array
      copies.push(shadowObject);
    }
  }

  return copies;
}

/**
 * Get the descriptions adding class names.
 * @param {string[]} classNames - The class names to add into descriptions.
 * @param {object} description - The description to add the class names.
 * @param {number} numberOfEdges - The number of edges.
 * @returns {object[]} The descriptions adding class names.
 */
function getDescriptionsAddingClassNames(classNames, description, numberOfEdges) {
  if (!classNames) {
    if (LOGS_WARNINGS_ACTIVE) {
      console.warn("No classNames found to add into descriptions");
    }

    return [];
  }

  let descriptions = [];
  let numberOfClasses = classNames?.length;

  if (numberOfClasses > 1) {
    descriptions = getDescriptionsCopies([{ ...description }], numberOfClasses, numberOfEdges);

    for (let d = 0; d < numberOfClasses; d++) {
      descriptions[d].id = `${descriptions[d].id} --> class-${classNameForId(classNames[d])}-${d}`;
      descriptions[d].value.className = classNames[d];
    }
  } else {
    description.id = `${description.id} --> class-${classNameForId(classNames[0])}-0`;
    description.value.className = classNames[0];
    descriptions.push(description);
  }

  return descriptions;
}

/**
 * Get the descriptions adding labels.
 * @param {string[]} labels - The labels to add into descriptions.
 * @param {string[]} classNames - The class names to add into descriptions.
 * @param {object} description - The description to add the labels.
 * @param {object[]} descriptions - The descriptions to add the labels.
 * @param {number} numberOfEdges - The number of edges.
 * @param {boolean} keepSameEdgeForAllLabels - Whether to keep the same edge for all labels.
 * @returns {object[]} The descriptions adding labels.
 */
function getDescriptionsAddingLabels(
  labels,
  classNames = undefined,
  description,
  descriptions = [],
  numberOfEdges = 0,
  keepSameEdgeForAllLabels = false,
) {
  if (!labels || labels.length === 0) {
    if (LOGS_WARNINGS_ACTIVE) {
      console.warn("No labels found to add into descriptions");
    }

    return [];
  }

  let numberOfLabels = labels.length;
  let numberOfClasses = classNames?.length;

  if (numberOfLabels > 1) {
    if (keepSameEdgeForAllLabels) {
      // Same edge for all copies (e.g. second ul's children all edge-0)
      const base = descriptions.length > 0 ? descriptions[0] : description;
      const baseId = base.id;

      descriptions = [];

      for (let i = 0; i < numberOfLabels; i++) {
        const copy = structuredClone(base);

        copy.id = `${replaceClassIndexInId(baseId, i)} --> label-${getInKebabCaseFormat(labels[i])}-${i}`;
        copy.value = { ...base.value, label: labels[i] };

        descriptions.push(copy);
      }
    } else if (descriptions.length > 0) {
      descriptions = getDescriptionsCopies([...descriptions], numberOfLabels, numberOfEdges);
    } else {
      descriptions = getDescriptionsCopies([{ ...description }], numberOfLabels, numberOfEdges);
    }

    if (!keepSameEdgeForAllLabels && numberOfClasses && numberOfClasses > 0) {
      let l = 0;

      for (let d = 0; d < descriptions.length; d++) {
        if (d % numberOfClasses === 0 || d === 0) {
          const baseId = descriptions[d].id;
          const labelSuffix = ` --> label-${getInKebabCaseFormat(labels[l])}-${l}`;

          descriptions[d].id = `${baseId}${labelSuffix}`;
          descriptions[d].value.label = labels[l];

          if (numberOfClasses > 1) {
            descriptions[d + (numberOfClasses - 1)].id = `${descriptions[d + (numberOfClasses - 1)].id}${labelSuffix}`;
            descriptions[d + (numberOfClasses - 1)].value.label = labels[l];
          }

          l++;
        }
      }
    } else if (!keepSameEdgeForAllLabels) {
      for (let d = 0; d < descriptions.length; d++) {
        descriptions[d].id = `${descriptions[d].id} --> label-${getInKebabCaseFormat(labels[d])}-${d}`;
        descriptions[d].value.label = labels[d];
      }
    }
  } else {
    description.id = `${description.id} --> label-${getInKebabCaseFormat(labels[0])}-0`;
    description.value.label = labels[0];

    // When node has only labels (no classNames), description was never added; push once.
    // When node has classNames + label, description is already in descriptions; do not push again to preserve sibling order.
    if (descriptions.length === 0) {
      descriptions.push(description);
    }
  }

  return descriptions;
}

/**
 * Get the descriptions adding next nodes.
 * @param {object[]} nextNodes - The next nodes to add into descriptions.
 * @param {object[]} descriptions - The descriptions to add the next nodes.
 * @param {number} numberOfEdges - The number of edges.
 * @returns {object[]} The descriptions adding next nodes.
 */
/**
 * Apply the same logic as dialog id: commandfor = model commandfor + index suffix.
 * @param {object} description - Description whose value.attributes may contain commandfor.
 * @param {number} index - Sibling index to append (e.g. 0, 1, 2).
 */
function setCommandForWithIndex(description, index) {
  const attrs = description?.value?.attributes;
  if (attrs == null) {
    return;
  }

  const flat = Array.isArray(attrs) ? Object.assign({}, ...attrs) : { ...attrs };

  if (flat.commandfor != null && typeof flat.commandfor === "string") {
    flat.commandfor = `${flat.commandfor}-${index}`;
    description.value.attributes = flat;
  }
}

function getDescriptionsAddingNextNodes(nextNodes, descriptions, numberOfEdges) {
  if (!descriptions) {
    return [];
  }

  if (!nextNodes) {
    for (const description of descriptions) {
      description.next = null;
    }

    return descriptions;
  }

  const firstNext = nextNodes[0];
  const secondNext = nextNodes[1];
  const childClassCount = firstNext?.classNames?.length || 1;
  const singleParentWithMultiChildClasses = descriptions.length === 1 && childClassCount > 1;

  // Checkbox-style: one parent, two next nodes (input + label), one has N labels -> N (input, label) pairs under same parent
  const labelCount = firstNext?.labels?.length || secondNext?.labels?.length || 0;
  const isInputLabelPair = firstNext?.tag === "input" && secondNext?.tag === "label";

  const checkboxStyleReplication =
    descriptions.length === 1 && nextNodes.length === 2 && labelCount > 1 && isInputLabelPair;

  // Dialog+trigger: one parent, two next nodes (dialog with N classNames, button with N labels) -> one parent with N (dialog, button) pairs as siblings (no parent replication)
  const isDialogTriggerPair = firstNext?.tag === "dialog" && secondNext?.tag === "button";

  const dialogTriggerStyle =
    descriptions.length === 1 &&
    nextNodes.length === 2 &&
    childClassCount > 1 &&
    (secondNext?.labels?.length ?? 0) >= childClassCount &&
    isDialogTriggerPair;

  if (dialogTriggerStyle) {
    const parentDesc = descriptions[0];
    const allChildren = [];
    // Model dialog id: use as base for element id (id + sibling index) and to resolve commandfor in buttons
    const baseId = firstNext?.id != null && typeof firstNext.id === "string" ? firstNext.id : null;

    for (let i = 0; i < childClassCount; i++) {
      const pairDescriptions = getDescriptions(nextNodes, parentDesc.id, 0, {
        classIndex: i,
        labelIndex: i,
      });

      if (pairDescriptions?.length) {
        if (!parentDesc.next) {
          parentDesc.next = [];
        }

        // Clone so each iteration has its own dialog/trigger; otherwise mutations overwrite previous iterations
        const dialogFromPair = pairDescriptions.find((d) => d.prev === parentDesc.id);
        const triggerFromPair = pairDescriptions.find((d) => d.value.tag === "button" && d.prev === parentDesc.id);
        const firstInPair = dialogFromPair ? structuredClone(dialogFromPair) : null;
        const triggerInPair = triggerFromPair ? structuredClone(triggerFromPair) : null;

        // Dialog element id = model id + sibling index (help.html: hggs-dialog-id-0, hggs-dialog-id-1, hggs-dialog-id-2)
        if (firstInPair && baseId != null) {
          firstInPair.value.id = `${baseId}-${i}`;
        }

        if (firstInPair?.id) {
          parentDesc.next.push(firstInPair.id);
        }

        if (triggerInPair?.id) {
          parentDesc.next.push(triggerInPair.id);
        }

        // Expand dialog with its children (header, section, footer, close/OK buttons, etc.)
        const dialogWithChildren =
          firstNext?.next?.length > 0 && firstInPair
            ? getDescriptionsAddingNextNodes(firstNext.next, [firstInPair], 0)
            : firstInPair
              ? [firstInPair]
              : [];

        // commandfor: same logic as id — model value + index suffix (help.html 204–205, 230–231, 237–238, etc.)
        for (const d of dialogWithChildren) {
          setCommandForWithIndex(d, i);
        }

        // Dialog sibling (trigger) buttons: commandfor must point to this dialog (e.g. Big -> hggs-dialog-id-0)
        if (triggerInPair) {
          setCommandForWithIndex(triggerInPair, i);
        }

        allChildren.push(...dialogWithChildren);

        if (triggerInPair) {
          allChildren.push(triggerInPair);
        }
      }
    }

    return [parentDesc, ...allChildren];
  }

  if (checkboxStyleReplication) {
    const parentDesc = descriptions[0];
    const allChildren = [];
    const baseName = firstNext?.attributes?.name ?? secondNext?.attributes?.name ?? "checkbox";

    for (let i = 0; i < labelCount; i++) {
      const pairDescriptions = getDescriptions(nextNodes, parentDesc.id, numberOfEdges, {
        classIndex: i,
        labelIndex: i,
        replicateIndex: i,
        replicateBaseName: baseName,
      });

      if (pairDescriptions?.length >= 2) {
        const [inputDesc, labelDesc] = pairDescriptions;

        if (labelDesc.value.tag === "label" && inputDesc.id) {
          labelDesc.value.attributes = {
            ...labelDesc.value.attributes,
            for: inputDesc.id,
          };
        }

        allChildren.push(inputDesc, labelDesc);

        if (!parentDesc.next) {
          parentDesc.next = [];
        }

        parentDesc.next.push(inputDesc.id, labelDesc.id);
      }
    }

    return [parentDesc, ...allChildren];
  }

  if (childClassCount <= 1 || !singleParentWithMultiChildClasses) {
    // Single child class: current behavior (one parent set, one getDescriptions call)
    let pointedDescriptions = [...descriptions];

    for (const description of descriptions) {
      const nextDescriptions = getDescriptions(nextNodes, description.id, numberOfEdges);

      if (!nextDescriptions?.length) {
        if (LOGS_WARNINGS_ACTIVE) {
          console.warn("No next nodes description found");
        }

        continue;
      }

      // Single (input, label) pair: set label for=input.id and input name=checkbox-0 (help.html edge-0)
      if (nextNodes.length === 2 && nextDescriptions.length >= 2) {
        const inputDesc = nextDescriptions.find((d) => d.value.tag === "input");
        const labelDesc = nextDescriptions.find((d) => d.value.tag === "label");

        if (inputDesc && labelDesc) {
          labelDesc.value.attributes = { ...labelDesc.value.attributes, for: inputDesc.id };

          const name = inputDesc.value.attributes?.name;

          if (name == null || name === "checkbox") {
            inputDesc.value.attributes = {
              ...inputDesc.value.attributes,
              name: "checkbox-0",
              type: "checkbox",
            };
          }
        }
      }

      for (const nextDescription of nextDescriptions) {
        for (const d of pointedDescriptions) {
          if (d.id === nextDescription.prev) {
            if (!d.next) {
              d.next = [];
            }

            d.next.push(nextDescription.id);
          }
        }
      }

      pointedDescriptions = pointedDescriptions.concat(nextDescriptions);
      numberOfEdges += nextDescriptions.length;
    }

    // Deduplicate by id (keep first occurrence) so we don't render duplicate DOM nodes per parent
    const seenIds = new Set();

    return pointedDescriptions.filter((d) => {
      if (seenIds.has(d.id)) {
        return false;
      }

      seenIds.add(d.id);
      return true;
    });
  }

  // Multiple child classes: replicate parent per child class (same edge, increment class index only)
  const baseDesc = descriptions[0];
  const replicatedParents = [];

  for (let i = 0; i < childClassCount; i++) {
    const parentDesc = structuredClone(baseDesc);

    parentDesc.id = replaceClassIndexInId(baseDesc.id, i);
    parentDesc.value = { ...baseDesc.value };

    replicatedParents.push(parentDesc);
  }

  const allChildren = [];

  for (let i = 0; i < childClassCount; i++) {
    const parentDesc = replicatedParents[i];

    // Pass edges=0 so children use parent's edge (e.g. edge-0 for both uls' children)
    const nextDescriptions = getDescriptions(nextNodes, parentDesc.id, 0, { classIndex: i });

    if (nextDescriptions?.length) {
      if (!parentDesc.next) {
        parentDesc.next = [];
      }

      for (const nd of nextDescriptions) {
        if (nd.id) {
          parentDesc.next.push(nd.id);
        }
      }

      allChildren.push(...nextDescriptions);
    }
  }

  return [...replicatedParents, ...allChildren];
}

/**
 * Get the descriptions adding class names, labels and next nodes.
 * @param {object[]} nodes - The nodes to get the descriptions.
 * @param {string} prevDescriptionId - The previous description id.
 * @param {number} edges - The number of edges.
 * @param {object} options - The options.
 * @returns {object[]} The descriptions.
 */
export function getDescriptions(nodes, prevDescriptionId = null, edges = 0, options = {}) {
  let descriptions = [];
  let numberOfEdges = edges;

  const { classIndex, labelIndex, replicateIndex, replicateBaseName } = options;

  if (!nodes || nodes.length === 0 || !Array.isArray(nodes)) {
    if (LOGS_WARNINGS_ACTIVE) {
      console.warn("No nodes found in the model");
    }

    return nodes;
  }

  for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
    const node = nodes[nodeIndex];

    let { tag, classNames, labels, prev, next, attributes, id: nodeId, command, commandfor } = node;

    if (classNames != null && !Array.isArray(classNames)) {
      classNames = [classNames];
    }

    if (labels != null && !Array.isArray(labels)) {
      labels = [labels];
    }

    if (typeof classIndex === "number" && classNames?.length > 1) {
      classNames = [classNames[classIndex]];
    }

    if (typeof labelIndex === "number" && labels?.length) {
      labels = [labels[labelIndex]];
    }

    if (typeof replicateIndex === "number" && replicateBaseName != null && attributes != null) {
      attributes = { ...attributes, name: `${replicateBaseName}-${replicateIndex}` };
    }

    // Merge top-level command/commandfor into attributes so buttons get them in the DOM
    const mergedAttributes =
      command != null || commandfor != null
        ? {
            ...(Array.isArray(attributes) ? Object.assign({}, ...attributes) : (attributes ?? {})),
            ...(command != null && { command }),
            ...(commandfor != null && { commandfor }),
          }
        : (attributes ?? null);

    // Root-level nodes with multiple classNames use same edge (nodeIndex) and class index 0,1,2... (box pattern)
    const isRootWithMultipleClasses = !prevDescriptionId && classNames?.length > 1;

    const description = {
      id: isRootWithMultipleClasses
        ? `edge-${nodeIndex} --> tag-${tag}`
        : prevDescriptionId
          ? `${prevDescriptionId} --> tag-${tag}`
          : `edge-${numberOfEdges} --> tag-${tag}`,
      value: {
        tag: tag || "div",
        className: null,
        label: null,
        attributes: mergedAttributes,
      },
      prev: null,
      next: null,
    };

    if (prev) {
      description.prev = prev;
    } else {
      if (prevDescriptionId) {
        description.prev = prevDescriptionId;
      }
    }

    let countAddedThisNode = 0;

    if (classNames?.length) {
      if (isRootWithMultipleClasses) {
        const newDescriptions = [];

        for (let d = 0; d < classNames.length; d++) {
          const copy = structuredClone(description);

          copy.id = `${description.id} --> class-${classNameForId(classNames[d])}-${d}`;
          copy.value = { ...description.value, className: classNames[d] };

          newDescriptions.push(copy);
        }

        descriptions = [...descriptions, ...newDescriptions];
        countAddedThisNode = newDescriptions.length;
        numberOfEdges = numberOfEdges + classNames.length;
      } else {
        // When single className and next is checkbox-style (2 nodes, one with N labels), use class index 1 for id (help.html).
        // - Exclude dialog+trigger so container gets class index 0.
        const isDialogTriggerNext = next?.length === 2 && next[0]?.tag === "dialog" && next[1]?.tag === "button";

        const isCheckboxPatternNext =
          next?.length === 2 && (next[0].labels?.length > 1 || next[1].labels?.length > 1) && !isDialogTriggerNext;

        const singleClassSuffix =
          typeof classIndex === "number" ? classIndex : isCheckboxPatternNext && classNames.length === 1 ? 1 : 0;

        if (classNames.length === 1) {
          description.id = `${description.id} --> class-${classNameForId(classNames[0])}-${singleClassSuffix}`;

          // Class attribute is always the base class (help.html: class="hggs-checkbox-input" not -0/-1/-2)
          description.value.className = classNames[0];

          descriptions = [...descriptions, description];
          countAddedThisNode = 1;
        } else {
          const descriptionsAddingClassNames = getDescriptionsAddingClassNames(classNames, description, numberOfEdges);

          descriptions = [...descriptions, ...descriptionsAddingClassNames];
          countAddedThisNode = descriptionsAddingClassNames.length;
        }

        numberOfEdges = numberOfEdges + classNames.length;
      }
    }

    if (labels) {
      // When we already added from classNames and we're in a single-variant context (labelIndex):
      // - Add label to existing description(s) to avoid duplicating (e.g. dialog trigger button)
      if (typeof labelIndex === "number" && countAddedThisNode > 0) {
        for (let i = 0; i < countAddedThisNode; i++) {
          const d = descriptions[descriptions.length - countAddedThisNode + i];
          d.id = `${d.id} --> label-${getInKebabCaseFormat(labels[0])}-0`;
          d.value.label = labels[0];
        }
      } else {
        // Use parent's edge when we have prevDescriptionId so first label copy matches parent id
        const parentEdge = prevDescriptionId?.match(/^edge-(\d+)/)?.[1];
        const edgeBaseForLabels = parentEdge != null ? parseInt(parentEdge, 10) : numberOfEdges;

        // When classIndex > 0 (e.g. second ul) keep same edge for all label copies (edge-0 for all)
        const keepSameEdgeForAllLabels = typeof classIndex === "number" && classIndex > 0;

        const descriptionsAddingLabels = getDescriptionsAddingLabels(
          labels,
          classNames,
          description,
          descriptions,
          edgeBaseForLabels,
          keepSameEdgeForAllLabels,
        );

        descriptions = [...descriptionsAddingLabels];
        countAddedThisNode = descriptionsAddingLabels.length;
      }
    }

    // When model provides id:
    // - Set value.id so the DOM element gets it (getNode uses value.id).
    // - Keep description.id unique for parent resolution.
    if (nodeId != null && typeof nodeId === "string" && countAddedThisNode > 0) {
      for (let i = 0; i < countAddedThisNode; i++) {
        descriptions[descriptions.length - countAddedThisNode + i].value.id = nodeId;
      }
    }

    if (next) {
      const currentBatch = countAddedThisNode ? descriptions.slice(-countAddedThisNode) : descriptions;
      const descriptionsAddingNextNodes = getDescriptionsAddingNextNodes(next, currentBatch, numberOfEdges);

      if (countAddedThisNode) {
        descriptions = [...descriptions.slice(0, -countAddedThisNode), ...descriptionsAddingNextNodes];
      } else {
        descriptions = [...descriptionsAddingNextNodes];
      }
    }
  }

  return descriptions;
}

/**
 * Append node to parent (or to root if parentNode is null).
 * @param {HTMLElement} node - The node to append.
 * @param {HTMLElement} rootNode - The root node.
 * @param {HTMLElement|null} parentNode - The parent DOM node, or null to append to root.
 * @returns {void}
 */
function appendNode(node, rootNode, parentNode = null) {
  const target = parentNode ?? rootNode;

  if (!target) {
    if (LOGS_WARNINGS_ACTIVE) {
      console.warn("No root node found, skipping append");
    }

    return;
  }

  target.appendChild(node);
}

/**
 * Get the node from the description and add the node id, classes and attributes and text content.
 * @param {object} description - The description to get the node.
 * @returns {HTMLElement} The node.
 */
function getNode(description) {
  // Create node
  const node = document.createElement(description.value.tag);

  // Add id: use model id (value.id) when provided, otherwise calculated description.id
  node.id = description.value.id != null ? description.value.id : description.id;

  // Add classes
  const classNames = description.value.className?.split(" ") || [];

  if (classNames.length > 0) {
    node.classList.add(...classNames);
  }

  // Add attributes (e.g. src, alt for img, command and commandfor for buttons)
  const attributes = description.value.attributes;

  if (attributes) {
    const entries = Array.isArray(attributes) ? Object.assign({}, ...attributes) : attributes;

    for (const [name, value] of Object.entries(entries)) {
      if (value != null) {
        node.setAttribute(name, value);
      }
    }
  }

  // Add text Content
  node.textContent = description.value.label;

  return node;
}

/**
 * Sort descriptions so that every parent (by prev id) appears before its children.
 * Uses depth-first traversal so order is always correct; handles duplicate prev ids.
 * @param {object[]} descriptions - The descriptions to sort.
 * @returns {object[]} Descriptions in append-safe order.
 */
function sortDescriptionsForAppend(descriptions) {
  const childrenByParentId = new Map();

  for (const d of descriptions) {
    const pid = d.prev ?? null;

    if (!childrenByParentId.has(pid)) {
      childrenByParentId.set(pid, []);
    }

    childrenByParentId.get(pid).push(d);
  }

  // When a parent has .next, order its direct children by that array so DOM order matches (e.g. dialog then button per pair)
  for (const d of descriptions) {
    const nextIds = d.next;

    if (!nextIds?.length) {
      if (LOGS_WARNINGS_ACTIVE) {
        console.warn("No next ids found for parent", d.id);
      }

      continue;
    }

    const children = childrenByParentId.get(d.id);

    if (!children?.length) {
      if (LOGS_WARNINGS_ACTIVE) {
        console.warn("No children found for parent", d.id);
      }

      continue;
    }

    const orderById = new Map(nextIds.map((id, i) => [id, i]));

    const withOrder = children.map((c) => ({
      desc: c,
      order: orderById.has(c.id) ? orderById.get(c.id) : nextIds.length,
    }));

    withOrder.sort((a, b) => a.order - b.order);

    childrenByParentId.set(
      d.id,
      withOrder.map((x) => x.desc),
    );
  }

  const ordered = [];

  function visit(desc) {
    ordered.push(desc);

    const children = childrenByParentId.get(desc.id) || [];

    for (const c of children) {
      visit(c);
    }
  }

  const roots = childrenByParentId.get(null) || [];

  for (const r of roots) {
    visit(r);
  }

  return ordered.length === descriptions.length ? ordered : descriptions;
}

/**
 * Render the model.
 * @param {object} model - The model to render.
 * @param {string} rootNodeId - The root node id.
 * @returns {void}
 */
export default function render(model, rootNodeId = null) {
  const rootNode = document.getElementById(rootNodeId || "hggs-root");

  if (!rootNode) {
    if (LOGS_WARNINGS_ACTIVE) {
      console.warn(`No root node found with id ${rootNodeId}`);
    }

    return;
  }

  const nodes = Array.isArray(model?.nodes) ? model.nodes : Array.isArray(model) ? model : [];
  const descriptions = sortDescriptionsForAppend(getDescriptions(nodes));

  if (!descriptions || descriptions.length === 0 || !Array.isArray(descriptions)) {
    throw new Error("No descriptions found to render the model");
  }

  // description id -> index in sorted list (so we can resolve parent by index)
  const idToIndex = new Map();

  for (let i = 0; i < descriptions.length; i++) {
    idToIndex.set(descriptions[i].id, i);
  }

  // index -> DOM node (parent is always at a lower index, so safe to look up when appending)
  const nodeByIndex = new Map();

  for (let i = 0; i < descriptions.length; i++) {
    const description = descriptions[i];
    const node = getNode(description);

    if (!node) {
      if (LOGS_WARNINGS_ACTIVE) {
        console.warn(`No node build with description id ${description.id}, continue with next description`);
      }

      continue;
    }

    // Keep description id on node (e.g. edge-0 --> tag-div --> class-hggs-container-0) so output matches help.html
    nodeByIndex.set(i, node);

    const parentIndex = description.prev != null ? idToIndex.get(description.prev) : undefined;
    const parentNode = parentIndex !== undefined ? nodeByIndex.get(parentIndex) : null;

    appendNode(node, rootNode, parentNode);
  }
}
