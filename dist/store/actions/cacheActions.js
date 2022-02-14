"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Action creator for adding messages to the cache
 * @param message Discord message object
 * @param settings Settings as defined in settings.hjson
 * @param detectionModules A list of the required modules from the detection-modules folder
 * @returns Redux store action
 */
const addMessage = (message, settings, detectionModules) => {
    const cacheMessage = { message, tags: [] };
    const payload = { cacheMessage, settings, detectionModules };
    const action = {
        type: "ADD_MESSAGE",
        payload
    };
    return action;
};
/**
 *
 * @returns Redux store action
 */
const flushCache = () => {
    const action = {
        type: "FLUSH_CACHE",
        payload: {},
    };
    return action;
};
exports.default = { addMessage, flushCache };
