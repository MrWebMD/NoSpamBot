const {
  tagMessage,
  getMessageLinks,
} = require("../helpers/message-helpers.js");

/**
 * Module Overview
 *
 * Name: linkSpray
 *
 * TAG: "LINKSPRAY"
 *
 * Description: This module tags "LINKSPRAY" to any
 * message that has the duplicate tag and also contains
 * a link.
 *
 */

/**
 *
 * @param {Array} messages Array of Discord Message Objects
 * @param {Object} settings Settings object as defined in settings.hjson
 * @returns {Array} An array of Discord Message objects. Except,
 * each object has a new property called "tags" (array of strings representing the types of spam)
 *
 * Example of message.tags:  ["DUPLICATE", "LINKSPRAY"]
 */

module.exports = (messages, settings) => {
  const { MODULE_TAG } = settings.modules.linkSpray;

  // No one should be spamming links. What good things might they
  // be up to?

  return messages.map((message) => {

    /**
     * Message must have a link to be considered for this
     * module.
     */

    if (getMessageLinks(message).length === 0) return message;

    /* Has the duplicate tag */

    if (!message.tags.includes(settings.modules.duplicates.MODULE_TAG))
      return message;

    tagMessage(message, MODULE_TAG);

    return message;
  });
};
