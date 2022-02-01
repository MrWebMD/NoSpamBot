const {
  tagMessage,
  getMessageLinks,
} = require("../helpers/message-helpers.js");

/**
 * Module Overview
 *
 * Name: mentionsEveryoneWithLinks
 *
 * TAG: "EVERYONEWITHLINKS"
 *
 * Description: This module tags "EVERYONEWITHLINKS" to any message mentioning everyone
 * with a link. Simple detection for obvious spam from self bots.
 *
 */

/**
 *
 * @param {Array} messages Array of Discord Message Objects
 * @param {Object} settings Settings object as defined in settings.hjson
 * @returns {Array} An array of Discord Message objects. Except,
 * each object has a new property called "tags" (array of strings representing the types of spam)
 *
 * Example of message.tags:  ["DUPLICATE", "EVERYONEWITHLINKS"]
 */

module.exports = (messages, settings) => {
  const { MODULE_TAG } = settings.modules.mentionsEveryoneWithLinks;

  // mentions here
  // has a link
  // up to no good

  return messages.map((message) => {
    const messageText = message.content.toLowerCase();

    /**
     * Message must have a link to be considered for this
     * module.
     */

    if (getMessageLinks(message).length === 0) return message;

    /* Mentions everyone */

    if (!messageText.includes("@everyone") && !messageText.includes("@here"))
      return message;

    tagMessage(message, MODULE_TAG);

    return message;
  });
};
