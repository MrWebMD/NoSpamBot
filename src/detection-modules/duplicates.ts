import deleteMessageSilently from "../mitigations/deleteMessageSilently.js";
import reportIncident from "../reporting/reportIncident.js";
import deleteMessage from "../mitigations/deleteMessage.js";
import timeoutMember from "../mitigations/timeoutMember.js";

import {
  getMessageDuplicates,
  getMessageDuplicatesByAuthor,
  getUniqueMembers,
  getUniqueMessagesByAuthor,
  tagMessage,
} from "../helpers/message-helpers.js";

import { durationFormat, authorListFormat } from "../helpers/formatters.js";
import { Client } from "discord.js";
import {
  CacheMessages,
  NoSpamModuleOptions,
  NoSpamSettings,
} from "../types/index.js";

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
 * @param messages Array of Discord message Objects
 * @param previouslyFlaggedMessages Array of Discord Message Objects that have tags from any detection module
 * @param moduleOptions Module settings as defined in settings.hjson
 * @returns Array of Discord message objects that have a new "tags" property. Tags is an array containing indentifying strings from the detection modules
 */
export const main = (
  messages: CacheMessages,
  previouslyFlaggedMessages: CacheMessages,
  moduleOptions: NoSpamModuleOptions
): CacheMessages => {
  const {
    maxDuplicatesPerUser,
    maxDuplicatesFromAnywhere,
    tag: MODULE_TAG,
  } = moduleOptions;

  // Array of discord message ID's

  var flaggedMessages: Array<string> = [];

  return messages.map((cacheMessage) => {
    
    // Multiple messages can be flagged within this map function.
    // If the messages is flagged and we just got to it, then
    // We will tag it and keep moving on.

    if (
      flaggedMessages.includes(cacheMessage.message.id) &&
      !cacheMessage.tags.includes(MODULE_TAG)
    ) {
      tagMessage(cacheMessage, MODULE_TAG);

      return cacheMessage;
    }

    /**
     * Any message from anyone that is similar in content
     * will automatically be considered by the spam bot.
     *
     * Useful for detecting raids
     */

    var similarMessages = getMessageDuplicates(cacheMessage, messages);

    /**
     * If you have the same content as another user's message
     * a certain amount of times (maxDuplicatesFromAnywhere)
     * then your message will be marked as a duplicate.
     */

    if (similarMessages.length >= maxDuplicatesFromAnywhere) {
      tagMessage(cacheMessage, MODULE_TAG);

      flaggedMessages.push(...similarMessages);
    }

    // Message matches a previously flagged message in the cache.

    if (
      getMessageDuplicates(cacheMessage, previouslyFlaggedMessages).length !== 0
    ) {
      tagMessage(cacheMessage, MODULE_TAG);
    }

    var similarMessagesByAuthor = getMessageDuplicatesByAuthor(
      cacheMessage,
      messages
    );

    /**
     * This particular author has sent too many messages
     * containing the same content.
     */

    if (similarMessagesByAuthor.length >= maxDuplicatesPerUser) {
      tagMessage(cacheMessage, MODULE_TAG);

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

    return cacheMessage;
  });
};

/**
 *
 * @param messages Discord message objects that have been tagged by this module
 * @param settings Settings as defined in settings.hjson
 * @param client Discord client object
 */
export const mitigation = (
  messages: CacheMessages,
  settings: NoSpamSettings,
  client: Client
): void => {
  const membersFromMessages = getUniqueMembers(messages);

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

  messages.forEach((cacheMessage, index, arr) => {
    if (index === 0 && arr.length > 1) {
      deleteMessage(cacheMessage, deletionMessage);
      return;
    }

    deleteMessageSilently(cacheMessage);
  });

  /**
   * Prevent all offending members from sending messages
   * for a period of time
   */

  membersFromMessages.forEach((member) => {
    timeoutMember(member, settings.mitigations.muteTime, "Duplicate messages");
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
