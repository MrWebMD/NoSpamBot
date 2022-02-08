const tempMute = require("./tempMute");

const mitigationEngine = (messageStore, settings, detectionModules) => {
  const messageCache = messageStore.getState();

  /**
   * Get the newly updated flagged messages array from
   * the store and give the appropriate response
   */

  var messagesAddressed = [];

  const sortedDetectionModules = detectionModules.sort(
    (module1, module2) => module1.mitigationOrder - module2.mitigationOrder
  );

  /**
   * Every message in this array of discord message objects
   * now has a new property named "tags". It is an array
   * of strings containing single word descriptions from
   * the module that detected it.
   * Some examples include "DUPLICATE" and "EVERYONEWITHLINKS"
   */

  for (let detectionModule of sortedDetectionModules) {
    var moduleTaggedMessages = messageCache.flaggedMessages.filter(
      (message) =>
        message.tags.includes(detectionModule.options.tag) &&
        !messagesAddressed.includes(message.id) &&
        !message.tags.includes("ARCHIVED")
    );

    messagesAddressed.push(...moduleTaggedMessages.map((m) => m.id));

    if (moduleTaggedMessages.length > 0) {
      detectionModule.mitigation(moduleTaggedMessages, settings);
    }
  }
};

module.exports = mitigationEngine;
