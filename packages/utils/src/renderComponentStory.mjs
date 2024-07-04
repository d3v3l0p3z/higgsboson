function getNodesModel({ tag, classes, modifiers, labels, next }) {
  let model = [];
  let nc = 0;

  const c = Array.isArray(classes) ? classes.join(" ") : classes ? classes : "";

  if (!model[nc]) {
    model[nc] = {
      tag: null,
      classes: null,
      label: null,
      next: null,
    };
  }

  model[nc].tag = tag || "div";
  model[nc].classes = c;

  if (modifiers) {
    for (const m of modifiers) {
      model[nc + 1] = {
        tag: tag || "div",
        classes: c + " " + m,
      };

      nc++;
    }
  }

  if (labels) {
    let mc = 0;

    for (const n of [...model]) {
      for (const l of labels) {
        model[mc] = { ...n };
        model[mc].label = l;
        mc++;
      }
    }
  }

  if (next) {
    for (const n of model) {
      n.next = getNodesModel({
        tag: next.tag,
        classes: next.classes,
        modifiers: null,
        labels: next.labels,
        next: next.next,
      });
    }

    if (next.modifiers) {
      for (const n of [...model]) {
        for (const m of next.modifiers) {
          model = [...model, { ...n }];

          model[model.length - 1].next = getNodesModel({
            tag: next.tag,
            classes: [...next.classes, m].join(" "),
            modifiers: null,
            labels: next.labels,
            next: next.next,
          });
        }
      }
    }
  }

  return model;
}

function getTitlesModel({ classes, modifiers, next }) {
  let model = [];
  let tc = 0;

  const t = Array.isArray(classes) ? classes.join(" ") : classes ? classes : "";

  if (!model[tc]) {
    model[tc] = {
      value: null,
      next: null,
    };
  }

  model[tc].value = t;

  if (modifiers) {
    for (const m of modifiers) {
      model[tc + 1] = {
        value: t + " " + m,
      };

      tc++;
    }
  }

  if (next) {
    for (const n of model) {
      n.next = getTitlesModel({
        classes: next.classes,
        modifiers: null,
        next: next.next,
      });
    }

    if (next.modifiers) {
      for (const n of [...model]) {
        for (const m of next.modifiers) {
          model = [...model, { ...n }];

          model[model.length - 1].next = getTitlesModel({
            classes: [...next.classes, m].join(" "),
            modifiers: null,
            next: next.next,
          });
        }
      }
    }
  }

  return model;
}

function getStoryModel({ title, structure }) {
  const model = {
    title: title,
    values: {
      titles: getTitlesModel({
        classes: structure.classes,
        modifiers: structure.modifiers,
        next: structure.next,
      }),
      nodes: getNodesModel(structure),
    },
  };

  return model;
}

function renderStoryTitleNode(storyTitleModel, storyHeaderNode, level) {
  const { value, next } = storyTitleModel;
  const storyTitleNode = document.createElement(`h${level}`);

  storyTitleNode.classList.add(`hggs-h${level}`);
  storyTitleNode.textContent = value;
  storyTitleNode.style.marginTop = "10px";
  storyTitleNode.style.marginBottom = "10px";

  if (level > 2) {
    storyTitleNode.style.marginLeft = `${level * 10}px`;
  }

  storyHeaderNode.appendChild(storyTitleNode);

  if (next) {
    for (const nextStoryTitleModel of next) {
      renderStoryTitleNode(nextStoryTitleModel, storyHeaderNode, level + 1);
    }
  }
}

function renderStoryStructureNode(storyStructureNodeModel, parentNode) {
  const { tag, classes, label, next } = storyStructureNodeModel;
  const storyStructureNode = document.createElement(tag);
  const classesArray = classes.split(" ");

  if (Array.isArray(classesArray)) {
    for (const c of classesArray) {
      storyStructureNode.classList.add(c);
    }
  }

  storyStructureNode.textContent = label;

  if (next) {
    for (const nextStoryStructureNodeModel of next) {
      renderStoryStructureNode(nextStoryStructureNodeModel, storyStructureNode);
    }
  }

  parentNode.appendChild(storyStructureNode);
}

function renderComponentStory(componentModel) {
  const storyModel = getStoryModel(componentModel);
  const titleNode = document.createElement("h1");

  titleNode.classList.add("hggs-h1");
  titleNode.style.marginTop = "0";
  titleNode.textContent = storyModel.title;

  const bodyNode = document.getElementsByTagName("body")[0];

  bodyNode.classList.add("hggs-app");
  bodyNode.classList.add("hggs-app--left");
  bodyNode.style.width = "100%";
  bodyNode.style.height = "100%";
  bodyNode.style.padding = "30px";
  bodyNode.appendChild(titleNode);

  const storyTitlesModel = storyModel.values.titles;

  let c = 0;

  for (const storyTitleModel of storyTitlesModel) {
    const storyHeaderNode = document.createElement("header");

    if (c !== 0) {
      storyHeaderNode.style.marginTop = "60px";
    }

    storyHeaderNode.style.marginBottom = "40px";

    const storyArticleNode = document.createElement("article");

    storyArticleNode.appendChild(storyHeaderNode);
    bodyNode.appendChild(storyArticleNode);

    renderStoryTitleNode(storyTitleModel, storyHeaderNode, 2);
    c++;
  }

  const storyStructureNodesModel = storyModel.values.nodes;

  for (let n = 0; n < storyStructureNodesModel.length; n++) {
    const storyStructureNodeModel = storyStructureNodesModel[n];
    const storyArticleNode = document.getElementsByTagName("article")[n];

    renderStoryStructureNode(storyStructureNodeModel, storyArticleNode);
  }
}

export default renderComponentStory;
