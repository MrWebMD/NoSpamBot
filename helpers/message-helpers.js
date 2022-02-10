const { Message, GuildMember } = require("discord.js");

/**
 * Removes messages that are older than a certain age from an
 * array of discord messages
 * @param {Array<Message>} messages List of discord message objects
 * @param {Number} maxAge Time in milliseconds that each message must be younger than
 * @returns {Array} Array of discord message objects that are younger than the max age
 */
const removeOldMessages = (messages, maxAge) => {
  return messages.filter((message) => getMessageAge(message) <= maxAge);
};

/**
 * Finds duplicate messages from a group of discord messages.
 * @param {Message} message Discord message object to be compared for duplicates
 * @param {Array<Message>} messages Array of discord message objects to be compared for duplicates
 * @returns {Array<String>} Array of message ids that have the same content
 */
const getMessageDuplicates = (message, messages) => {
  return messages
    .filter(
      (similarMessage) =>
        similarMessage.content.toLowerCase() === message.content.toLowerCase()
    )
    .map((message) => message.id);
};

/**
 * Find duplicate messages that were sent from the author of an orginating discord message
 * @param {Message} message Discord message object to be compared for duplicates
 * @param {Array<Message>} messages Array of discord message objects
 * @returns {Array<String>} List of discord message ids that are duplicates, that are also sent from the message author
 */
const getMessageDuplicatesByAuthor = (message, messages) => {
  return getMessageDuplicates(
    message,
    messages.filter((m) => m.author.id === message.author.id)
  );
};

/**
 * Log out a group of messages to the console in one large table.
 * @param {Array<Object>} messages Array of discord message objects (modified with a .tags[] property)
 */
const messagesToTable = (messages) => {
  /**
   * Logs out an array of processed
   * messages as an array to the console
   */

  /**
   * Converts milliseconds to seconds
   * @param {Number} ms Time in milliseconds 
   * @returns {Number} Time in seconds
   */
  const msToSeconds = (ms) => Math.floor(ms / 1000);

  console.log("");
  console.table(
    messages.map((message) => {
      return {
        TAGS: message.tags.join(","),
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
 * @param {Message} message Discord message object
 * @returns {Array<String>} Array of links found in the message content
 */
const getMessageLinks = (message) => {
  return message.content.match(/((https?:\/\/)?[^\s.]+\.[\w][^\s]+)/g) || [];
};
/**
 * Get a list of unique guild members from a group of messages 
 * @param {Array<Message>} messages Array of discord message objects
 * @returns {Array<GuildMember>} Array of unique GuildMember objects from the group of messages
 */
const getUniqueMembers = (messages) => {
  var memberIds = [];
  var members = [];
  for (let message of messages) {
    const { id: authorId } = message.author;
    if (!memberIds.includes(authorId)) {
      memberIds.push(authorId);
      members.push(message.member);
    }
  }
  return members;
};

/**
 * Get a list of messages containing one message from each author
 * @param {Array<Message>} messages List of Discord message objects
 * @returns {Array<Message>} Array of messages containing one message per author
 */
const getUniqueMessagesByAuthor = (messages) => {
  var authorIds = [];
  var uniqueMessages = [];
  for (let message of messages) {
    const { id: authorId } = message.author;
    if (!authorIds.includes(authorId)) {
      authorIds.push(authorId);
      uniqueMessages.push(message);
    }
  }
  return uniqueMessages;
};

/**
 * Censor links from any given discord message
 * @param {Message} message Discord message object
 * @returns {String} Message content with censored links.
 */

const defangMessageLinks = (message) => {
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

const tagMessage = (message, tag) => {
  /* Mutate the original message by adding a new tag */

  if (!message.tags.includes(tag)) {
    message.tags.push(tag);
  }
};
/**
 *
 * @param {Object} message Discord message object
 * @returns Boolean If message contains only an attachment with no content
 */
const messageContainsOnlyFile = (message) => {
  return message.content === "" && message.attachments.size !== 0;
};
/**
 *
 * @param {Array} messages Discord message objects
 * @param {String} tag The tag describing the message content
 */
const tagMessages = (messages, tag) => {
  /* Mutate the original messages by adding a new tag */

  messages.map((message) => {
    tagMessage(message, tag);
  });
};
/**
 *
 * @param {Object} message Discord message object
 * @returns Boolean If the message has an embed
 */
const messageHasEmbeds = (message) => {
  return message.embeds.length > 0;
};

/**
 *
 * @param {Object} message Discord message object
 * @returns String containing the users tag ex. Dom#0107
 */
const getAuthorTag = (message) =>
  `${message.author.username}#${message.author.discriminator}`;

/**
 *
 * @param {Object} message Discord message object
 * @returns Number Time in milliseconds that the message has existed
 */
const getMessageAge = (message) => {
  return Date.now() - message.createdTimestamp;
};

module.exports = {
  removeOldMessages,
  getMessageDuplicates,
  getMessageAge,
  messageHasEmbeds,
  getMessageDuplicatesByAuthor,
  tagMessages,
  tagMessage,
  getMessageLinks,
  defangMessageLinks,
  messagesToTable,
  getUniqueMembers,
  messageContainsOnlyFile,
  getAuthorTag,
  getUniqueMessagesByAuthor,
};
