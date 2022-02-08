const {
  tagMessage,
  getMessageLinks,
} = require("../helpers/message-helpers.js");
const deleteMessage = require("../mitigations/deleteMessage.js");
const quarantineMessage = require("../mitigations/quarantineMessage.js");

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

module.exports.main = (messages, previouslyFlaggedMessages, moduleOptions) => {
  const { tag: MODULE_TAG } = moduleOptions;

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

module.exports.mitigation = (messages, settings) => {

  console.log("mention me if i'm cool")
  for (let message of messages) {
    console.log("Mentions everyone with links mitigation");
    deleteMessage(message, "For your safety this message has automatically been removed by the creator.");
    // quarantineMessage(message, "For your safety this message has automatically been removed.", "Message embed creator");
  }
  // quarantineMessage(message, "Mentions everyone with a link");
};
