"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageAge = exports.getAuthorTag = exports.messageHasEmbeds = exports.tagMessages = exports.messageContainsOnlyFile = exports.tagMessage = exports.defangMessageLinks = exports.getUniqueMessagesByAuthor = exports.getUniqueMembers = exports.getMessageLinks = exports.messagesToTable = exports.getMessageDuplicatesByAuthor = exports.getMessageDuplicates = exports.removeOldMessages = void 0;
/**
 * Removes messages that are older than a certain age from an
 * array of discord messages
 * @param messages List of discord message objects
 * @param maxAge Time in milliseconds that each message must be younger than
 * @returns Array of discord message objects that are younger than the max age
 */
const removeOldMessages = (messages, maxAge) => {
    return messages.filter((cacheMessage) => (0, exports.getMessageAge)(cacheMessage.message) <= maxAge);
};
exports.removeOldMessages = removeOldMessages;
/**
 * Finds duplicate messages from a group of discord messages.
 * @param message Discord message object to be compared for duplicates
 * @param messages Array of discord message objects to be compared for duplicates
 * @returns Array of message ids that have the same content
 */
const getMessageDuplicates = (cacheMessage, messages) => {
    return messages
        .filter((similarMessage) => similarMessage.message.content.toLowerCase() ===
        cacheMessage.message.content.toLowerCase())
        .map((message) => message.message.id);
};
exports.getMessageDuplicates = getMessageDuplicates;
/**
 * Find duplicate messages that were sent from the author of an orginating discord message
 * @param message Discord message object to be compared for duplicates
 * @param messages Array of discord message objects
 * @returns List of discord message ids that are duplicates, that are also sent from the message author
 */
const getMessageDuplicatesByAuthor = (cacheMessage, messages) => {
    return (0, exports.getMessageDuplicates)(cacheMessage, messages.filter((m) => m.message.author.id === cacheMessage.message.author.id));
};
exports.getMessageDuplicatesByAuthor = getMessageDuplicatesByAuthor;
/**
 * Log out a group of messages to the console in one large table.
 * @param messages Array of discord message objects (modified with a .tags[] property)
 */
const messagesToTable = (cacheMessages) => {
    /**
     * Logs out an array of processed
     * messages as an array to the console
     */
    /**
     * Converts milliseconds to seconds
     * @param ms Time in milliseconds
     * @returns Time in seconds
     */
    const msToSeconds = (ms) => Math.floor(ms / 1000);
    console.log("");
    console.table(cacheMessages.map((cacheMessage) => {
        const { message } = cacheMessage;
        return {
            TAGS: cacheMessage.tags.join(","),
            CONTENT: message.content.substr(0, 15) + "...",
            ID: message.id,
            AGE: msToSeconds((0, exports.getMessageAge)(message)) + "s",
        };
    }));
    console.log("");
};
exports.messagesToTable = messagesToTable;
/**
 * Extract links from a given message
 * @param message Discord message object
 * @returns Array of links found in the message content
 */
const getMessageLinks = (message) => {
    return message.content.match(/((https?:\/\/)?[^\s.]+\.[\w][^\s]+)/g) || [];
};
exports.getMessageLinks = getMessageLinks;
/**
 * Get a list of unique guild members from a group of messages
 * @param messages Array of discord message objects
 * @returns Array of unique GuildMember objects from the group of messages
 */
const getUniqueMembers = (messages) => {
    var memberIds = [];
    var members = [];
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
exports.getUniqueMembers = getUniqueMembers;
/**
 * Get a list of messages containing one message from each author
 * @param messages List of Discord message objects
 * @returns Array of messages containing one message per author
 */
const getUniqueMessagesByAuthor = (messages) => {
    var authorIds = [];
    var uniqueMessages = [];
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
exports.getUniqueMessagesByAuthor = getUniqueMessagesByAuthor;
/**
 * Censor links from any given discord message
 * @param  message Discord message object
 * @returns Message content with censored links.
 */
const defangMessageLinks = (message) => {
    const messageLinks = (0, exports.getMessageLinks)(message);
    var defangedText = message.content;
    for (let link of messageLinks) {
        var thirdLinkLength = Math.floor(link.length / 3);
        var thirdOfLink = link.substr(thirdLinkLength, thirdLinkLength);
        var newLink = link.replaceAll(thirdOfLink, ".".repeat(thirdLinkLength));
        defangedText = defangedText.replaceAll(link, newLink);
    }
    return defangedText;
};
exports.defangMessageLinks = defangMessageLinks;
/**
 * Add a unique descriptor to define this message's features
 * @param message Discord message object
 * @param tag Short and unique descriptor to define this message's features
 */
const tagMessage = (message, tag) => {
    /* Mutate the original message by adding a new tag */
    if (!message.tags.includes(tag)) {
        message.tags.push(tag);
    }
};
exports.tagMessage = tagMessage;
/**
 *
 * @param message Discord message object
 * @returns Boolean If message contains only an attachment with no content
 */
const messageContainsOnlyFile = (message) => {
    return message.content === "" && message.attachments.size !== 0;
};
exports.messageContainsOnlyFile = messageContainsOnlyFile;
/**
 * Add a unique descriptor to define the features of a group of messages
 * @param messages Discord message objects
 * @param tag The tag describing the message content
 */
const tagMessages = (messages, tag) => {
    /* Mutate the original messages by adding a new tag */
    messages.map((message) => {
        (0, exports.tagMessage)(message, tag);
    });
};
exports.tagMessages = tagMessages;
/**
 *
 * @param message Discord message object
 * @returns If the message has an embed
 */
const messageHasEmbeds = (message) => {
    return message.embeds.length > 0;
};
exports.messageHasEmbeds = messageHasEmbeds;
/**
 *
 * @param message Discord message object
 * @returns String containing the users tag ex. Dom#0107
 */
const getAuthorTag = (message) => `${message.author.username}#${message.author.discriminator}`;
exports.getAuthorTag = getAuthorTag;
/**
 *
 * @param message Discord message object
 * @returns Number Time in milliseconds that the message has existed
 */
const getMessageAge = (message) => {
    return Date.now() - message.createdTimestamp;
};
exports.getMessageAge = getMessageAge;
