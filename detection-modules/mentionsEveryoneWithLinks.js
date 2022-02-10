const {
  tagMessage,
  getMessageLinks,
  getUniqueMembers,
  getUniqueMessagesByAuthor,
} = require("../helpers/message-helpers.js");

const {
  durationFormat,
  authorListFormat,
} = require("../helpers/formatters.js");

const deleteMessage = require("../mitigations/deleteMessage.js");
const timeoutMember = require("../mitigations/timeoutMember.js");
const reportIncident = require("../reporting/reportIncident.js");

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
 * @param {Array} messages Array of Discord message Objects
 * @param {Array} previouslyFlaggedMessages Array of Discord Message Objects that have tags from any detection module
 * @param {Object} moduleOptions Module settings as defined in settings.hjson
 * @returns {Array} Array of Discord message objects that have a new "tags" property. Tags is an array containing indentifying strings from the detection modules
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

/**
 *
 * @param {Array} messages Discord message objects that have been tagged by this module
 * @param {Object} settings Settings as defined in settings.hjson
 * @param {Object} client Discord client object
 */

module.exports.mitigation = (messages, settings, client) => {
  const uniqueMessagesByAuthor = getUniqueMessagesByAuthor(messages);

  const membersFromMessages = getUniqueMembers(messages);

  // The message content that will show in the embed.

  const deletionMessage = `For your safety this message has automatically been removed. Please do not mention everyone with a link. ${authorListFormat(
    membersFromMessages
  )} has been timed out for ${durationFormat(settings.mitigations.muteTime)}.`;

  // Delete all messages and send a message with each

  for (let message of messages) {
    deleteMessage(message, deletionMessage);
  }

  /**
   * Prevent all offending members from sending messages
   * for a period of time
   */

  membersFromMessages.forEach((member) => {
    timeoutMember(member, settings.mitigations.muteTime);
  });

  /**
   * Send a copy of the offending messages
   * and reasons to a log channel.
   */

  reportIncident(
    uniqueMessagesByAuthor,
    client,
    settings.reporting.logChannelId,
    deletionMessage
  );
};
