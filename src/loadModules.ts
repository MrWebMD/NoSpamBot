import { DetectionModuleSettings, DetectionModule } from "./types";

export default (moduleList: Array<DetectionModuleSettings>): Array<DetectionModule> => {
  var loadedModules: Array<DetectionModule> = [];

  for (let moduleSettings of moduleList) {

    const {
      name,
      path: modulePath,
      detectionOrder,
      mitigationOrder,
      options = { tag: "" }
    } = moduleSettings;

    const { main, mitigation } = require(modulePath);

    let loadedModule: DetectionModule = {
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
