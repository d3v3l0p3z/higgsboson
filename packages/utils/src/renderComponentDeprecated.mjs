import setGlobalDataModel from "./setGlobalDataModel.mjs";
import loadThemeStyles from "./loadThemeStyles.mjs";
import renderTemplateIntoBodyDomNode from "./renderTemplateIntoBodyDomNode.mjs";

async function renderComponentDeprecated({ model, configuration }) {
  if (!model || !configuration) {
    throw new Error("Try to render component without model or configuration");
  }

  setGlobalDataModel(model);
  renderTemplateIntoBodyDomNode(model);
  loadThemeStyles(configuration);
}

export default renderComponentDeprecated;
