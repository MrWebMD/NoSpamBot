const {
  tagMessage,
  getMessageLinks,
  getUniqueMembers,
} = require("../helpers/message-helpers.js");
const quarantineMessage = require("../mitigations/quarantineMessage.js");
const deleteMessage = require("../mitigations/deleteMessage.js");
const deleteMessageSilently = require("../mitigations/deleteMessageSilently.js");
const timeoutMember = require("../mitigations/timeoutMember.js");
const { tagFormat } = require("../helpers/formatters.js");
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

module.exports.main = (messages, previouslyFlaggedMessages, moduleOptions) => {
  const { tag: MODULE_TAG } = moduleOptions;

  // No one should be spamming links. What good things might they
  // be up to?

  return messages.map((message) => {
    /**
     * Message must have a link to be considered for this
     * module.
     */

    if (getMessageLinks(message).length === 0) return message;

    /* Has the duplicate tag */

    if (!message.tags.includes("DUPLICATE")) return message;

    tagMessage(message, MODULE_TAG);

    return message;
  });
};

module.exports.mitigation = (messages, settings) => {
  console.log("Link spray everywhere");

  // for (let message of messages) {

  // }
  // quarantineMessage(message, "For your safety this message has automatically been removed.", "Potential link spray attack");

  messages.forEach((message, index, arr) => {
    if (index === 0 && arr.length > 1) {
      const deleteMessageContent = `Automatically removed ${
        arr.length
      } duplicate message${
        arr.length > 1 ? "s" : ""
      } because they seem to be spamming links. Do not spam links.\n\n${tagFormat(
        message.tags
      )}`;

      deleteMessage(message, deleteMessageContent);
      return;
    }
    deleteMessageSilently(message);
  });
  getUniqueMembers(messages).forEach((member) => {
    timeoutMember(member, settings.mitigations.muteTime);
  });
};
