import {
  tagMessage,
  getMessageLinks,
  getUniqueMembers,
  getUniqueMessagesByAuthor,
} from "../helpers/message-helpers.js";

import { durationFormat, authorListFormat } from "../helpers/formatters.js";

import deleteMessage from "../mitigations/deleteMessage.js";
import timeoutMember from "../mitigations/timeoutMember.js";
import reportIncident from "../reporting/reportIncident.js";
import { CacheMessages, NoSpamModuleOptions, NoSpamSettings } from "../types/index.js";
import { Client } from "discord.js";

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

  // mentions here
  // has a link
  // up to no good

  return messages.map((cacheMessage) => {
    const messageText = cacheMessage.message.content.toLowerCase();

    /**
     * Message must have a link to be considered for this
     * module.
     */

    if (getMessageLinks(cacheMessage.message).length === 0) return cacheMessage;

    /* Mentions everyone */

    if (!messageText.includes("@everyone") && !messageText.includes("@here"))
      return cacheMessage;

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

  const deletionMessage = `For your safety this message has automatically been removed. Please do not mention everyone with a link. ${authorListFormat(
    membersFromMessages
  )} has been timed out for ${durationFormat(settings.mitigations.muteTime)}.`;

  // Delete all messages and send a message with each

  for (let cacheMessage of messages) {
    deleteMessage(cacheMessage, deletionMessage);
  }

  /**
   * Prevent all offending members from sending messages
   * for a period of time
   */

  membersFromMessages.forEach((member) => {
    timeoutMember(member, settings.mitigations.muteTime, "Sent a message that mentioned everyone with a link");
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
