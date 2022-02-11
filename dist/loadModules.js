"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (moduleList) => {
    var loadedModules = [];
    for (let moduleSettings of moduleList) {
        const { name, path: modulePath, detectionOrder, mitigationOrder, options = { tag: "" } } = moduleSettings;
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
