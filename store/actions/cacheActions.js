const { Message } = require("discord.js");

/**
 * Action options for the redux message cache/store
 * @typedef {Object} CacheAction
 * @property {String} type Name of the action to be taken
 * @property {Object} payload Data to be used with the action
 */

/**
 * Action creator for adding messages to the cache
 * @param {Message} message Discord message object
 * @param {Object} settings Settings as defined in settings.hjson
 * @param {Array} detectionModules A list of the required modules from the detection-modules folder
 * @returns {Action} Redux store action
 */
module.exports.addMessage = (message, settings, detectionModules) => {
  

  const cacheMessage = new CacheMessage(message);

  /**
   * @type {CacheAction}
   */
  const action = {
    type: "ADD_MESSAGE",
    payload: { cacheMessage, settings, detectionModules },
  };

  return action;
};

/**
 *
 * @returns Redux store action
 */
module.exports.flushCache = () => {
  return {
    type: "FLUSH_CACHE",
    payload: {},
  };
};
