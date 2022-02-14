"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const formatters_1 = require("../helpers/formatters");
const message_helpers_js_1 = require("../helpers/message-helpers.js");
/**
 * Generate Summary (messages, incidentDescription)
 *
 * Title: Incident report
 *
 * Thumbnail:
 *
 * - Description of what happened and actions taken (incidentDescription)
 *
 * # AuthorName#0000
 * - Author ID - Message ID -
 * - Evidence: <defanged message content>
 * - tags
 *
 * # AuthorName#0000
 * - Author ID - Message ID
 * - Evidence <defanged message content>
 * - tags
 *
 * Footer
 */
/**
 *
 * @param messages List of Discord message objects
 * @param incidentDescription Why these messages were removed. Used as the header for the embed
 * @returns Discord MessageEmbed object
 */
exports.default = (messages, incidentDescription) => {
    var title = (messages.length > 1 ? "Combined " : "") + "Incident Report";
    const color = "#03326d";
    const thumbnail = "https://i.imgur.com/jiecmUR.png";
    var embedFields = [];
    messages.forEach((cacheMessage) => {
        embedFields.push(...getIncidentFieldsForSingleIncident(cacheMessage));
    });
    return new discord_js_1.default.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(incidentDescription)
        .setThumbnail(thumbnail)
        .addFields(...embedFields, {
        name: "Learn more",
        value: "[Github](https://github.com/MrWebMD/NoSpamBot)",
        inline: false,
    })
        .setTimestamp()
        .setFooter({
        text: "Made with ❤️ by Dom#0107",
    });
};
/**
 * Generate embed fields for a single offending message
 * @param message Discord Message object
 * @returns Array of embed fields
 */
const getIncidentFieldsForSingleIncident = (cacheMessage) => {
    const { message } = cacheMessage;
    var fields = [];
    fields.push({
        name: "Author",
        value: (0, message_helpers_js_1.getAuthorTag)(cacheMessage.message),
        inline: true,
    });
    fields.push({
        name: "Author ID",
        value: message.author.id,
        inline: true,
    });
    fields.push({
        name: "Message ID",
        value: message.id,
        inline: true,
    });
    fields.push({
        name: "Evidence",
        value: (0, formatters_1.codeFormat)((0, message_helpers_js_1.defangMessageLinks)(message).substr(0, 150) + "..."),
        inline: false,
    });
    fields.push({
        name: "Tags",
        value: (0, formatters_1.tagFormat)(cacheMessage.tags),
        inline: false,
    });
    fields.push({
        name: "\u200B",
        value: "\u200B",
        inline: false,
    });
    return fields;
};
