import Discord from "discord.js";
import { CacheMessage, CacheMessages } from "../types";

/**
 * Removes messages that are older than a certain age from an
 * array of discord messages
 * @param messages List of discord message objects
 * @param maxAge Time in milliseconds that each message must be younger than
 * @returns Array of discord message objects that are younger than the max age
 */
export const removeOldMessages = (
  messages: CacheMessages,
  maxAge: number
): CacheMessages => {
  return messages.filter(
    (cacheMessage) => getMessageAge(cacheMessage.message) <= maxAge
  );
};

/**
 * Finds duplicate messages from a group of discord messages.
 * @param message Discord message object to be compared for duplicates
 * @param messages Array of discord message objects to be compared for duplicates
 * @returns Array of message ids that have the same content
 */

export const getMessageDuplicates = (
  cacheMessage: CacheMessage,
  messages: CacheMessages
): Array<string> => {
  return messages
    .filter(
      (similarMessage) =>
        similarMessage.message.content.toLowerCase() ===
        cacheMessage.message.content.toLowerCase()
    )
    .map((message) => message.message.id);
};

/**
 * Find duplicate messages that were sent from the author of an orginating discord message
 * @param message Discord message object to be compared for duplicates
 * @param messages Array of discord message objects
 * @returns List of discord message ids that are duplicates, that are also sent from the message author
 */
export const getMessageDuplicatesByAuthor = (
  cacheMessage: CacheMessage,
  messages: CacheMessages
): Array<string> => {
  return getMessageDuplicates(
    cacheMessage,
    messages.filter(
      (m) => m.message.author.id === cacheMessage.message.author.id
    )
  );
};

/**
 * Log out a group of messages to the console in one large table.
 * @param messages Array of discord message objects (modified with a .tags[] property)
 */
export const messagesToTable = (cacheMessages: CacheMessages): void => {
  /**
   * Logs out an array of processed
   * messages as an array to the console
   */

  /**
   * Converts milliseconds to seconds
   * @param ms Time in milliseconds
   * @returns Time in seconds
   */
  const msToSeconds = (ms: number) => Math.floor(ms / 1000);

  console.log("");
  console.table(
    cacheMessages.map((cacheMessage: CacheMessage) => {
      const { message } = cacheMessage;

      return {
        TAGS: cacheMessage.tags.join(","),
        CONTENT: message.content.substr(0, 15) + "...",
        ID: message.id,
        AGE: msToSeconds(getMessageAge(message)) + "s",
      };
    })
  );
  console.log("");
};
/**
 * Extract links from a given message
 * @param message Discord message object
 * @returns Array of links found in the message content
 */
export const getMessageLinks = (message: Discord.Message): Array<string> => {
  return message.content.match(/((https?:\/\/)?[^\s.]+\.[\w][^\s]+)/g) || [];
};

/**
 * Get a list of unique guild members from a group of messages
 * @param messages Array of discord message objects
 * @returns Array of unique GuildMember objects from the group of messages
 */
export const getUniqueMembers = (
  messages: CacheMessages
): Array<Discord.GuildMember> => {
  var memberIds: Array<string> = [];

  var members: Array<Discord.GuildMember> = [];

  for (let cacheMessage of messages) {
    const { message } = cacheMessage;
    const { id: authorId } = message.author;

    if (!memberIds.includes(authorId) && message.member) {
      memberIds.push(authorId);

      members.push(message.member);
    }
  }
  return members;
};

/**
 * Get a list of messages containing one message from each author
 * @param messages List of Discord message objects
 * @returns Array of messages containing one message per author
 */
export const getUniqueMessagesByAuthor = (
  messages: CacheMessages
): CacheMessages => {
  var authorIds: Array<string> = [];
  var uniqueMessages: CacheMessages = [];

  for (let cacheMessage of messages) {
    const { message } = cacheMessage;
    const { id: authorId } = message.author;

    if (!authorIds.includes(authorId)) {
      authorIds.push(authorId);

      uniqueMessages.push(cacheMessage);
    }
  }
  return uniqueMessages;
};

/**
 * Censor links from any given discord message
 * @param  message Discord message object
 * @returns Message content with censored links.
 */

export const defangMessageLinks = (message: Discord.Message): string => {
  const messageLinks = getMessageLinks(message);

  var defangedText = message.content;

  for (let link of messageLinks) {
    var thirdLinkLength = Math.floor(link.length / 3);
    var thirdOfLink = link.substr(thirdLinkLength, thirdLinkLength);
    var newLink = link.replaceAll(thirdOfLink, ".".repeat(thirdLinkLength));

    defangedText = defangedText.replaceAll(link, newLink);
  }

  return defangedText;
};

/**
 * Add a unique descriptor to define this message's features
 * @param message Discord message object
 * @param tag Short and unique descriptor to define this message's features
 */
export const tagMessage = (message: CacheMessage, tag: string): void => {
  /* Mutate the original message by adding a new tag */

  if (!message.tags.includes(tag)) {
    message.tags.push(tag);
  }
};
/**
 *
 * @param message Discord message object
 * @returns Boolean If message contains only an attachment with no content
 */
export const messageContainsOnlyFile = (message: Discord.Message): boolean => {
  return message.content === "" && message.attachments.size !== 0;
};
/**
 * Add a unique descriptor to define the features of a group of messages
 * @param messages Discord message objects
 * @param tag The tag describing the message content
 */
export const tagMessages = (messages: CacheMessages, tag: string): void => {
  /* Mutate the original messages by adding a new tag */

  messages.map((message) => {
    tagMessage(message, tag);
  });
};
/**
 *
 * @param message Discord message object
 * @returns If the message has an embed
 */
export const messageHasEmbeds = (message: Discord.Message): boolean => {
  return message.embeds.length > 0;
};

/**
 *
 * @param message Discord message object
 * @returns String containing the users tag ex. Dom#0107
 */
export const getAuthorTag = (message: Discord.Message): string =>
  `${message.author.username}#${message.author.discriminator}`;

/**
 *
 * @param message Discord message object
 * @returns Number Time in milliseconds that the message has existed
 */
export const getMessageAge = (message: Discord.Message): number => {
  return Date.now() - message.createdTimestamp;
};
