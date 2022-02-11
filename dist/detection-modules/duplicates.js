"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mitigation = exports.main = void 0;
const deleteMessageSilently_js_1 = __importDefault(require("../mitigations/deleteMessageSilently.js"));
const reportIncident_js_1 = __importDefault(require("../reporting/reportIncident.js"));
const deleteMessage_js_1 = __importDefault(require("../mitigations/deleteMessage.js"));
const timeoutMember_js_1 = __importDefault(require("../mitigations/timeoutMember.js"));
const message_helpers_js_1 = require("../helpers/message-helpers.js");
const formatters_js_1 = require("../helpers/formatters.js");
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
const main = (messages, previouslyFlaggedMessages, moduleOptions) => {
    const { maxDuplicatesPerUser, maxDuplicatesFromAnywhere, tag: MODULE_TAG, } = moduleOptions;
    // Array of discord message ID's
    var flaggedMessages = [];
    return messages.map((cacheMessage) => {
        // Multiple messages can be flagged within this map function.
        // If the messages is flagged and we just got to it, then
        // We will tag it and keep moving on.
        if (flaggedMessages.includes(cacheMessage.message.id) &&
            !cacheMessage.tags.includes(MODULE_TAG)) {
            (0, message_helpers_js_1.tagMessage)(cacheMessage, MODULE_TAG);
            return cacheMessage;
        }
        /**
         * Any message from anyone that is similar in content
         * will automatically be considered by the spam bot.
         *
         * Useful for detecting raids
         */
        var similarMessages = (0, message_helpers_js_1.getMessageDuplicates)(cacheMessage, messages);
        /**
         * If you have the same content as another user's message
         * a certain amount of times (maxDuplicatesFromAnywhere)
         * then your message will be marked as a duplicate.
         */
        if (similarMessages.length >= maxDuplicatesFromAnywhere) {
            (0, message_helpers_js_1.tagMessage)(cacheMessage, MODULE_TAG);
            flaggedMessages.push(...similarMessages);
        }
        // Message matches a previously flagged message in the cache.
        if ((0, message_helpers_js_1.getMessageDuplicates)(cacheMessage, previouslyFlaggedMessages).length !== 0) {
            (0, message_helpers_js_1.tagMessage)(cacheMessage, MODULE_TAG);
        }
        var similarMessagesByAuthor = (0, message_helpers_js_1.getMessageDuplicatesByAuthor)(cacheMessage, messages);
        /**
         * This particular author has sent too many messages
         * containing the same content.
         */
        if (similarMessagesByAuthor.length >= maxDuplicatesPerUser) {
            (0, message_helpers_js_1.tagMessage)(cacheMessage, MODULE_TAG);
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
exports.main = main;
/**
 *
 * @param messages Discord message objects that have been tagged by this module
 * @param settings Settings as defined in settings.hjson
 * @param client Discord client object
 */
const mitigation = (messages, settings, client) => {
    const membersFromMessages = (0, message_helpers_js_1.getUniqueMembers)(messages);
    const uniqueMessagesByAuthor = (0, message_helpers_js_1.getUniqueMessagesByAuthor)(messages);
    // The message content that will show in the embed.
    const deletionMessage = `Automatically removed ${messages.length} duplicate message${messages.length > 1 ? "s" : ""}. Please avoid being repetitive. ${(0, formatters_js_1.authorListFormat)(membersFromMessages)} has been timed out for ${(0, formatters_js_1.durationFormat)(settings.mitigations.muteTime)}.`;
    /**
     * Delete every message
     * except for the first message.
     * The first message will be replied to
     * using the deletion message.
     */
    messages.forEach((cacheMessage, index, arr) => {
        if (index === 0 && arr.length > 1) {
            (0, deleteMessage_js_1.default)(cacheMessage, deletionMessage);
            return;
        }
        (0, deleteMessageSilently_js_1.default)(cacheMessage);
    });
    /**
     * Prevent all offending members from sending messages
     * for a period of time
     */
    membersFromMessages.forEach((member) => {
        (0, timeoutMember_js_1.default)(member, settings.mitigations.muteTime, "Duplicate messages");
    });
    /**
     * Send a copy of the offending messages
     * and reasons to a log channel.
     */
    (0, reportIncident_js_1.default)(uniqueMessagesByAuthor, client, settings.reporting.logChannelId, deletionMessage);
};
exports.mitigation = mitigation;
