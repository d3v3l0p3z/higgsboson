function getComponentsMenuItemDomNode(menuItem) {
  const componentMenuItemNode = document.createElement("li");
  const componentMenuItemLinkNode = document.createElement("a");

  componentMenuItemNode.classList = "hggs-list-item";
  componentMenuItemLinkNode.innerHTML = menuItem?.name;
  componentMenuItemLinkNode.setAttribute("href", menuItem?.path);
  componentMenuItemNode.appendChild(componentMenuItemLinkNode);

  if (menuItem?.new) {
    const componentMenuItemNewNode = document.createElement("span");

    componentMenuItemNewNode.classList = "hggs-tag hggs-tag--small hggs-tag--secondary hggs-tag--rounded";
    componentMenuItemLinkNode.innerHTML = "new";
    componentMenuItemNode.appendChild(componentMenuItemNewNode);
  }

  return componentMenuItemNode;
}

async function addComponentsMenuDomNode(menuItems) {
  if (!menuItems || menuItems.length === 0) {
    return;
  }

  const componentsMenuDomNode = document.getElementById("components-menu");

  menuItems.forEach((n) => {
    const componentsMenuItemDomNode = getComponentsMenuItemDomNode(n);
    componentsMenuDomNode.appendChild(componentsMenuItemDomNode);
  });
}

export default addComponentsMenuDomNode;
