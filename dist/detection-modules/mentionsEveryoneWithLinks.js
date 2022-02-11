"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mitigation = exports.main = void 0;
const message_helpers_js_1 = require("../helpers/message-helpers.js");
const formatters_js_1 = require("../helpers/formatters.js");
const deleteMessage_js_1 = __importDefault(require("../mitigations/deleteMessage.js"));
const timeoutMember_js_1 = __importDefault(require("../mitigations/timeoutMember.js"));
const reportIncident_js_1 = __importDefault(require("../reporting/reportIncident.js"));
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
const main = (messages, previouslyFlaggedMessages, moduleOptions) => {
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
        if ((0, message_helpers_js_1.getMessageLinks)(cacheMessage.message).length === 0)
            return cacheMessage;
        /* Mentions everyone */
        if (!messageText.includes("@everyone") && !messageText.includes("@here"))
            return cacheMessage;
        (0, message_helpers_js_1.tagMessage)(cacheMessage, MODULE_TAG);
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
    const uniqueMessagesByAuthor = (0, message_helpers_js_1.getUniqueMessagesByAuthor)(messages);
    const membersFromMessages = (0, message_helpers_js_1.getUniqueMembers)(messages);
    // The message content that will show in the embed.
    const deletionMessage = `For your safety this message has automatically been removed. Please do not mention everyone with a link. ${(0, formatters_js_1.authorListFormat)(membersFromMessages)} has been timed out for ${(0, formatters_js_1.durationFormat)(settings.mitigations.muteTime)}.`;
    // Delete all messages and send a message with each
    for (let cacheMessage of messages) {
        (0, deleteMessage_js_1.default)(cacheMessage, deletionMessage);
    }
    /**
     * Prevent all offending members from sending messages
     * for a period of time
     */
    membersFromMessages.forEach((member) => {
        (0, timeoutMember_js_1.default)(member, settings.mitigations.muteTime, "Sent a message that mentioned everyone with a link");
    });
    /**
     * Send a copy of the offending messages
     * and reasons to a log channel.
     */
    (0, reportIncident_js_1.default)(uniqueMessagesByAuthor, client, settings.reporting.logChannelId, deletionMessage);
};
exports.mitigation = mitigation;
