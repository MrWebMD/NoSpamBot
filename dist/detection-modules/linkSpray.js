"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mitigation = exports.main = void 0;
const deleteMessageSilently_js_1 = __importDefault(require("../mitigations/deleteMessageSilently.js"));
const deleteMessage_js_1 = __importDefault(require("../mitigations/deleteMessage.js"));
const reportIncident_js_1 = __importDefault(require("../reporting/reportIncident.js"));
const timeoutMember_js_1 = __importDefault(require("../mitigations/timeoutMember.js"));
const message_helpers_js_1 = require("../helpers/message-helpers.js");
const formatters_js_1 = require("../helpers/formatters.js");
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
const main = (messages, previouslyFlaggedMessages, moduleOptions) => {
    const { tag: MODULE_TAG } = moduleOptions;
    // No one should be spamming links. What good things might they
    // be up to?
    return messages.map((cacheMessage) => {
        /**
         * Message must have a link to be considered for this
         * module.
         */
        if ((0, message_helpers_js_1.getMessageLinks)(cacheMessage.message).length === 0)
            return cacheMessage;
        /* Has the duplicate tag */
        if (!cacheMessage.tags.includes("DUPLICATE"))
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
    const deletionMessage = `Automatically removed ${messages.length} duplicate message${messages.length > 1 ? "s" : ""} because they seem to be spamming links. Do not spam links. ${(0, formatters_js_1.authorListFormat)(membersFromMessages)} has been timed out for ${(0, formatters_js_1.durationFormat)(settings.mitigations.muteTime)}.`;
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
        (0, timeoutMember_js_1.default)(member, settings.mitigations.muteTime, "Potential link spray attack");
    });
    /**
     * Send a copy of the offending messages
     * and reasons to a log channel.
     */
    (0, reportIncident_js_1.default)(uniqueMessagesByAuthor, client, settings.reporting.logChannelId, deletionMessage);
};
exports.mitigation = mitigation;
