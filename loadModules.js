module.exports = (moduleList) => {
  var loadedModules = [];

  for (let detectionModule of moduleList) {
    const { name, path: modulePath, detectionOrder, mitigationOrder, options = {} } = detectionModule;

    const { main, mitigation } = require(modulePath);

    let loadedModule = {
      name,
      path: modulePath,
      detectionOrder,
      mitigationOrder,
      options,
      main,
      mitigation,
    };

    loadedModules.push(loadedModule);
  }

  return loadedModules;
};
