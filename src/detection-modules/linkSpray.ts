import { Client } from "discord.js";
import { CacheMessages, NoSpamModuleOptions, NoSpamSettings } from "../types";

import deleteMessageSilently from "../mitigations/deleteMessageSilently.js";
import deleteMessage from "../mitigations/deleteMessage.js";
import reportIncident from "../reporting/reportIncident.js";
import timeoutMember from "../mitigations/timeoutMember.js";

import {
  tagMessage,
  getMessageLinks,
  getUniqueMembers,
  getUniqueMessagesByAuthor,
} from "../helpers/message-helpers.js";

import { durationFormat, authorListFormat } from "../helpers/formatters.js";

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
  const { tag: MODULE_TAG } = moduleOptions;

  // No one should be spamming links. What good things might they
  // be up to?

  return messages.map((cacheMessage) => {
    /**
     * Message must have a link to be considered for this
     * module.
     */

    if (getMessageLinks(cacheMessage.message).length === 0) return cacheMessage;

    /* Has the duplicate tag */

    if (!cacheMessage.tags.includes("DUPLICATE")) return cacheMessage;

    tagMessage(cacheMessage, MODULE_TAG);

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
    timeoutMember(
      member,
      settings.mitigations.muteTime,
      "Potential link spray attack"
    );
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
