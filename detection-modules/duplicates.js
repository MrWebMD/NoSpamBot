const {
  getMessageDuplicates,
  getMessageDuplicatesByAuthor,
  tagMessage,
} = require("../helpers/message-helpers.js");

/**
 * Module Overview
 *
 * Name: Duplicates
 *
 * TAG: "DUPLICATE"
 *
 * Description: This module tags "DUPLICATE" to any message that appears
 * more than once (as specified in settings.hjson).
 *
 * There is an enforced limit for individual duplicate message contents (maxDuplicatesPerUser),
 * and for duplicate message contents over the course of an entire chat (maxDuplicatesFromAnywhere).
 *
 */

/**
 *
 * @param {Array} messages Array of Discord Message Objects
 * @param {Object} settings Settings object as defined in settings.hjson
 * @returns {Array} An array of Discord Message objects. Except,
 * each object has a new property called "tags" (array of strings representing the types of spam)
 *
 * Example of message.tags:  ["DUPLICATE", "NITROSCAM"]
 */

module.exports = (messages, previouslyFlaggedMessages, settings) => {
  const { maxDuplicatesPerUser, maxDuplicatesFromAnywhere, MODULE_TAG } =
    settings.modules.duplicates;

  // Array of discord message ID's

  var flaggedMessages = [];

  return messages.map((message) => {
    if (
      flaggedMessages.includes(message.id) &&
      !message.tags.includes(MODULE_TAG)
    ) {
      tagMessage(message, MODULE_TAG);
      return message;
    }

    /**
     * Any message from anyone that is similar in content
     * will automatically be considered by the spam bot.
     *
     * Useful for detecting raids
     */

    var similarMessages = getMessageDuplicates(message, messages);

    if (similarMessages.length >= maxDuplicatesFromAnywhere) {
      tagMessage(message, MODULE_TAG);
      flaggedMessages.push(...similarMessages);
    }

    // Message matches a previously flagged message in the cache.

    if(getMessageDuplicates(message, previouslyFlaggedMessages).length !== 0) {
      tagMessage(message, MODULE_TAG);
    }

    /**
     * If the offending message by an individual has
     * not already been added to the group of
     * flagged messages, then add it.
     */

    var similarMessagesByAuthor = getMessageDuplicatesByAuthor(message, messages);

    if (similarMessagesByAuthor.length >= maxDuplicatesPerUser) {
      tagMessage(message, MODULE_TAG);

      for (let messageID of similarMessagesByAuthor) {
        if (!flaggedMessages.includes(messageID)) {
          flaggedMessages.push(messageID);
        }
      }
    }
    return message;
  });
};
