const deleteMessageSilently = require("../mitigations/deleteMessageSilently.js");
const deleteMessage = require("../mitigations/deleteMessage.js");
const reportIncident = require("../reporting/reportIncident.js");
const timeoutMember = require("../mitigations/timeoutMember.js");

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
 * @param {Array} messages Array of Discord message Objects
 * @param {Array} previouslyFlaggedMessages Array of Discord Message Objects that have tags from any detection module
 * @param {Object} moduleOptions Module settings as defined in settings.hjson
 * @returns {Array} Array of Discord message objects that have a new "tags" property. Tags is an array containing indentifying strings from the detection modules
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

  const deletionMessage = `Automatically removed ${
    messages.length
  } duplicate message${
    messages.length > 1 ? "s" : ""
  } because they seem to be spamming links. Do not spam links. ${authorListFormat(
    membersFromMessages
  )} has been timed out for ${durationFormat(settings.mitigations.muteTime)}.`;

  /**
   * Delete every message
   * except for the first message.
   * The first message will be replied to
   * using the deletion message.
   */

  messages.forEach((message, index, arr) => {
    if (index === 0 && arr.length > 1) {
      deleteMessage(message, deletionMessage);
      return;
    }
    deleteMessageSilently(message);
  });

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
