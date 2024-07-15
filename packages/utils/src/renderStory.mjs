function getNextStructureHasMoreThanOneClass(next) {
  if (!next || !Array.isArray(next) || next.length === 0) {
    return false;
  }

  for (let n = 0; n < next.length; n++) {
    if (next[n].classes && Array.isArray(next[n].classes) && next[n].classes.length > 1) {
      return true;
    }
  }

  return false;
}

function getNodesModel(structures) {
  const nodes = [];

  for (let s = 0; s < structures.length; s++) {
    const structure = structures[s];

    const { tag, classes, labels, next } = structure;

    const structureHasAtLeastOneClass = classes && Array.isArray(classes) && classes.length > 0;
    const structureHasAtLeastOneLabel = classes && Array.isArray(labels) && labels.length > 0;
    const nextStructureHasMoreThanOneClass = getNextStructureHasMoreThanOneClass(next);

    nodes[s] = [];

    if (structureHasAtLeastOneClass) {
      for (let c = 0; c < classes.length; c++) {
        if (nextStructureHasMoreThanOneClass) {
          for (let n = 0; n < next.length; n++) {
            for (let nc = 0; nc < next[n].classes.length; nc++) {
              if (structureHasAtLeastOneLabel) {
                for (let l = 0; l < labels.length; l++) {
                  const newNode = {
                    tag,
                    class: classes[c],
                    label: labels[l],
                    next: null,
                  };

                  if (next && next.length > 0) {
                    const nn = { ...next[n] };
                    nn.classes = [next[n].classes[nc]];
                    newNode.next = getNodesModel([nn]);
                  }

                  nodes[s].push(newNode);
                }
              } else {
                const newNode = {
                  tag,
                  class: classes[c],
                  label: null,
                  next: null,
                };

                if (next && next.length > 0) {
                  const nn = { ...next[n] };
                  nn.classes = [next[n].classes[nc]];
                  newNode.next = getNodesModel([nn]);
                }

                nodes[s].push(newNode);
              }
            }
          }
        } else {
          if (structureHasAtLeastOneLabel) {
            const newNode = [];

            for (let l = 0; l < labels.length; l++) {
              newNode[l] = {
                tag,
                class: classes[c],
                label: labels[l],
                next: null,
              };

              if (next && next.length > 0) {
                newNode.next = getNodesModel(next);
              }
            }

            nodes[s].push(newNode);
          } else {
            const newNode = {
              tag,
              class: classes[c],
              label: null,
              next: null,
            };

            if (next && next.length > 0) {
              newNode.next = getNodesModel(next);
            }

            nodes[s].push(newNode);
          }
        }
      }
    }
  }

  return nodes;
}

function getTitlesModel(structures) {
  let titles = [];

  for (let s = 0; s < structures.length; s++) {
    const structure = structures[s];

    const { classes, next } = structure;

    const structureHasAtLeastOneClass = classes && Array.isArray(classes) && classes.length > 0;
    const nextStructureHasMoreThanOneClass = getNextStructureHasMoreThanOneClass(next);

    titles[s] = [];

    if (structureHasAtLeastOneClass) {
      for (let c = 0; c < classes.length; c++) {
        if (nextStructureHasMoreThanOneClass) {
          for (let n = 0; n < next.length; n++) {
            for (let nc = 0; nc < next[n].classes.length; nc++) {
              const newTitle = {
                value: classes[c],
                next: null,
              };

              if (next && next.length > 0) {
                const nt = { ...next[n] };
                nt.classes = [next[n].classes[nc]];
                newTitle.next = getTitlesModel([nt]);
              }

              titles[s].push(newTitle);
            }
          }
        } else {
          const newTitle = {
            value: classes[c],
            next: null,
          };

          if (next && next.length > 0) {
            newTitle.next = getTitlesModel(next);
          }

          titles[s].push(newTitle);
        }
      }
    }
  }

  return titles;
}

function getStoryModel({ title, structures }) {
  const model = {
    title: title,
    values: {
      titles: getTitlesModel(structures),
      nodes: getNodesModel(structures),
    },
  };

  return model;
}

function renderTitles(titlesModel, headerNode, level) {
  const isACollection = Array.isArray(titlesModel);

  if (isACollection) {
    for (const titleModel of titlesModel) {
      renderTitles(titleModel, headerNode, level);
    }

    return;
  }

  const { value, next } = titlesModel;
  const titleNode = document.createElement(`h${level}`);

  titleNode.classList.add(`hggs-h${level}`);
  titleNode.textContent = value;
  titleNode.style.marginTop = "10px";
  titleNode.style.marginBottom = "10px";

  if (level > 2) {
    titleNode.style.marginLeft = `${(level - 3) * 50 + 50}px`;
  }

  headerNode.appendChild(titleNode);

  if (next) {
    for (const nextTitleModel of next) {
      renderTitles(nextTitleModel, headerNode, level + 1);
    }
  }
}

function renderNodes(nodesModel, parentNode) {
  const isACollection = Array.isArray(nodesModel);

  if (isACollection) {
    for (const nodeModel of nodesModel) {
      renderNodes(nodeModel, parentNode);
    }

    return;
  }

  const { tag, class: c, label, next } = nodesModel;
  const node = document.createElement(tag);

  const haveMoreThanOneClass = c && c.includes(" ");

  if (haveMoreThanOneClass) {
    const classes = c.split(" ");

    for (const classItem of classes) {
      node.classList.add(classItem);
    }
  } else {
    node.classList.add(c);
  }

  node.textContent = label;

  if (next) {
    for (const nextNodesModel of next) {
      renderNodes(nextNodesModel, node);
    }
  }

  parentNode.appendChild(node);
}

function renderStory(model) {
  const storyModel = getStoryModel(model);

  // title
  const titleNode = document.createElement("h1");

  titleNode.classList.add("hggs-h1");
  titleNode.style.marginTop = "0";
  titleNode.textContent = storyModel.title;

  // body
  const bodyNode = document.getElementsByTagName("body")[0];

  bodyNode.classList.add("hggs-app");
  bodyNode.classList.add("hggs-app--left");
  bodyNode.style.width = "100%";
  bodyNode.style.height = "100%";
  bodyNode.style.padding = "30px";

  bodyNode.appendChild(titleNode);

  // titles
  const titlesModels = storyModel.values.titles;

  for (let t = 0; t < titlesModels.length; t++) {
    const titlesModel = titlesModels[t];
    const isACollection = Array.isArray(titlesModel);

    if (isACollection) {
      for (let i = 0; i < titlesModel.length; i++) {
        const titleModel = titlesModel[i];
        const headerNode = document.createElement("header");
        const articleNode = document.createElement("article");

        if (t !== 0) {
          headerNode.style.marginTop = "60px";
        } else {
          headerNode.style.marginBottom = "40px";
        }

        renderTitles(titleModel, headerNode, 2);

        articleNode.id = `story-${t}${i}`;
        articleNode.style.width = "100%";
        articleNode.appendChild(headerNode);

        bodyNode.appendChild(articleNode);
      }
    } else {
      const headerNode = document.createElement("header");
      const articleNode = document.createElement("article");

      if (t !== 0) {
        headerNode.style.marginTop = "60px";
      } else {
        headerNode.style.marginBottom = "40px";
      }

      renderTitles(titlesModel, headerNode, 2);

      articleNode.id = `story-${t}`;
      articleNode.style.width = "100%";
      articleNode.appendChild(headerNode);

      bodyNode.appendChild(articleNode);
    }
  }

  // nodes
  const nodesModels = storyModel.values.nodes;

  for (let n = 0; n < nodesModels.length; n++) {
    const nodesModel = nodesModels[n];
    const isACollection = Array.isArray(nodesModel);

    if (isACollection) {
      for (let i = 0; i < nodesModel.length; i++) {
        const nodeModel = nodesModel[i];
        const articleNode = document.getElementById(`story-${n}${i}`);

        renderNodes(nodeModel, articleNode);
      }
    } else {
      const articleNode = document.getElementById(`story-${n}`);

      renderNodes(storyStructureNodeModels, articleNode);
    }
  }
}

export default renderStory;
