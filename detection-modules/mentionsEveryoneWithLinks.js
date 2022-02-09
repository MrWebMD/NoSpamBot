const {
  tagMessage,
  getMessageLinks,
  getUniqueMembers,
  getAuthorTag,
} = require("../helpers/message-helpers.js");

const { durationFormat, tagFormat } = require("../helpers/formatters.js");
const deleteMessage = require("../mitigations/deleteMessage.js");
const timeoutMember = require("../mitigations/timeoutMember.js");

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
  for (let message of messages) {

    const deleteMessageContent = `For your safety this message has automatically been removed. ${getAuthorTag(message)} has been timed out for ${durationFormat(
      settings.mitigations.muteTime
    )}.\n\n${tagFormat(message.tags)}`;
    deleteMessage(message, deleteMessageContent);
  }
  getUniqueMembers(messages).forEach((member) => {
    timeoutMember(member, settings.mitigations.muteTime);
  });
};
