const quarantineMessage = require('./quarantineMessage.js');
const flagMessage = require('./flagMessage.js');

const mitigationEngine = (messageStore, settings) => {
  const messageCache = messageStore.getState();

  /**
   * Get the newly updated flagged messages array from
   * the store and give the appropriate response
   */

  const { duplicates, mentionsEveryoneWithLinks, linkSpray } =
   settings.modules;

  for (message of messageCache.flaggedMessages) {
    if (message.tags.includes("ARCHIVED")) {
      continue;
    }

    /**
     * Every message in this array of discord message objects
     * now has a new property named "tags". It is an array
     * of strings containing single word descriptions from
     * the module that detected it.
     * Some examples include "DUPLICATE" and "EVERYONEWITHLINKS"
     */


    if (message.tags.includes(mentionsEveryoneWithLinks.MODULE_TAG)) {
      quarantineMessage(message, "Mentions everyone with a link");
      continue;
    }

    if(message.tags.includes(linkSpray.MODULE_TAG)) {
      quarantineMessage(message, "Potential link spray attack");
      continue;
    }

    if (message.tags.includes(duplicates.MODULE_TAG)) {
      flagMessage(message)
      continue;
    }

  }
};

module.exports = mitigationEngine;
