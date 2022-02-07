const tempMute = require("./tempMute");

const mitigationEngine = (messageStore, settings, detectionModules) => {
  const messageCache = messageStore.getState();

  /**
   * Get the newly updated flagged messages array from
   * the store and give the appropriate response
   */

  var alreadyMutedAuthors = [];

  var flaggedMessages = [];

  for (message of messageCache.flaggedMessages) {
    if (message.tags.includes("ARCHIVED")) {
      continue;
    }

    const { id: authorId } = message.author;

    // Every offending author gets a temp mute.
    
    if (!alreadyMutedAuthors.includes(authorId)) {
    
      tempMute(message, settings);
    
      alreadyMutedAuthors.push(authorId);
    
    }

    /**
     * Every message in this array of discord message objects
     * now has a new property named "tags". It is an array
     * of strings containing single word descriptions from
     * the module that detected it.
     * Some examples include "DUPLICATE" and "EVERYONEWITHLINKS"
     */

     const sortedDetectionModules = detectionModules.sort(
      (module1, module2) => module1.mitigationOrder - module2.mitigationOrder
    );

    for(let detectionModule of sortedDetectionModules) {

      console.log(detectionModule.name, detectionModule.mitigationOrder, message.tags, detectionModule.options.tag)

      if(message.tags.includes(detectionModule.options.tag)) {
        detectionModule.mitigation(message);
        break;
      }
    }
    console.log("Module loop was cut short");
  }
};

module.exports = mitigationEngine;
