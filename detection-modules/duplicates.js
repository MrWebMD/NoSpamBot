const deleteMessageSilently = require("../mitigations/deleteMessageSilently.js");
const reportIncident = require("../reporting/reportIncident.js");
const deleteMessage = require("../mitigations/deleteMessage.js");
const timeoutMember = require("../mitigations/timeoutMember.js");

const {
  getMessageDuplicates,
  getMessageDuplicatesByAuthor,
  getUniqueMembers,
  getUniqueMessagesByAuthor,
  tagMessage,
} = require("../helpers/message-helpers.js");

const {
  durationFormat,
  authorListFormat,
} = require("../helpers/formatters.js");
const { Message, MessageManager, DiscordAPIError } = require("discord.js");

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
 * @param {Array} messages Array of Discord message Objects
 * @param {Array} previouslyFlaggedMessages Array of Discord Message Objects that have tags from any detection module
 * @param {Object} moduleOptions Module settings as defined in settings.hjson
 * @returns {Array} Array of Discord message objects that have a new "tags" property. Tags is an array containing indentifying strings from the detection modules
 */
module.exports.main = (messages, previouslyFlaggedMessages, moduleOptions) => {
  const {
    maxDuplicatesPerUser,
    maxDuplicatesFromAnywhere,
    tag: MODULE_TAG,
  } = moduleOptions;

  // Array of discord message ID's

  var flaggedMessages = [];

  return messages.map((message) => {
    // Multiple messages can be flagged within this map function.
    // If the messages is flagged and we just got to it, then
    // We will tag it and keep moving on.

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

    /**
     * If you have the same content as another user's message
     * a certain amount of times (maxDuplicatesFromAnywhere)
     * then your message will be marked as a duplicate.
     */

    if (similarMessages.length >= maxDuplicatesFromAnywhere) {
      tagMessage(message, MODULE_TAG);

      flaggedMessages.push(...similarMessages);
    }

    // Message matches a previously flagged message in the cache.

    if (getMessageDuplicates(message, previouslyFlaggedMessages).length !== 0) {
      tagMessage(message, MODULE_TAG);
    }

    var similarMessagesByAuthor = getMessageDuplicatesByAuthor(
      message,
      messages
    );

    /**
     * This particular author has sent too many messages
     * containing the same content.
     */

    if (similarMessagesByAuthor.length >= maxDuplicatesPerUser) {
      tagMessage(message, MODULE_TAG);

      for (let messageID of similarMessagesByAuthor) {
        /**
         * If the offending message by an individual has
         * not already been added to the group of
         * flagged messages, then add it.
         */

        if (!flaggedMessages.includes(messageID)) {
          flaggedMessages.push(messageID);
        }
      }
    }

    return message;
  });
};

/**
 *
 * @param {Array<Message>} messages Discord message objects that have been tagged by this module
 * @param {Object} settings Settings as defined in settings.hjson
 * @param {Object} client Discord client object
 */
module.exports.mitigation = (messages, settings, client) => {
  const membersFromMessages = getUniqueMembers(messages);

  for(let m of messages){ 
    m
  }

  const uniqueMessagesByAuthor = getUniqueMessagesByAuthor(messages);

  // The message content that will show in the embed.

  const deletionMessage = `Automatically removed ${
    messages.length
  } duplicate message${
    messages.length > 1 ? "s" : ""
  }. Please avoid being repetitive. ${authorListFormat(
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
