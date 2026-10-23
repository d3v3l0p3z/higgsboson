function loadThemeStyle(higgsbosonConfiguration) {
  const cssFileHref = `${higgsbosonConfiguration?.outputPath}${higgsbosonConfiguration?.outputFilename}.css`;

  return new Promise(function (resolve, reject) {
    let themeLinkStyles = document.createElement("link");

    themeLinkStyles.href = cssFileHref;
    themeLinkStyles.rel = "stylesheet";

    themeLinkStyles.onload = () => resolve(themeLinkStyles);
    themeLinkStyles.onerror = () => reject(new Error(`Style load error for ${themeLinkStyles.href}`));

    document.head.append(themeLinkStyles);

    let coreLinkStyles = document.createElement("link");

    coreLinkStyles.href = `${higgsbosonConfiguration?.outputPath}/higgsboson-core.css`;
    coreLinkStyles.rel = "stylesheet";

    coreLinkStyles.onload = () => resolve(themeLinkStyles);
    coreLinkStyles.onerror = () => reject(new Error(`Style load error for ${coreLinkStyles.href}`));

    document.head.append(coreLinkStyles);
  });
}

export default loadThemeStyle;
