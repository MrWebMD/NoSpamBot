"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const message_helpers_js_1 = require("../helpers/message-helpers.js");
const formatters_js_1 = require("../helpers/formatters.js");
/**
 * Generate a quarantine embed for a given message
 * @param message Discord message object
 * @param reason Overview of what happened, will be used as the header for the embed
 * @param description Why this message was quarantined, will be used for extra details
 * @returns Discord MessageEmbed object
 */
exports.default = (cacheMessage, reason, description) => {
    const { message } = cacheMessage;
    const previewText = (0, message_helpers_js_1.defangMessageLinks)(message).substr(0, 150) + "...";
    const title = "NoSpam quarantined this message";
    const color = "#0099ff";
    const authorTag = (0, message_helpers_js_1.getAuthorTag)(message);
    const iconURL = message.author.avatarURL() || "";
    const thumbnail = "https://i.imgur.com/dRI2bdJ_d.webp";
    return new discord_js_1.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setAuthor({
        name: authorTag,
        iconURL,
    })
        .setDescription(reason)
        .setThumbnail(thumbnail)
        .addFields({
        name: "Defanged preview",
        value: (0, formatters_js_1.codeFormat)(previewText),
    }, {
        name: "Description",
        value: (0, formatters_js_1.codeFormat)(description),
    }, {
        name: "Tags",
        value: (0, formatters_js_1.codeFormat)(cacheMessage.tags.join(", ")),
    }, {
        name: "Author ID",
        value: (0, formatters_js_1.codeFormat)(message.author.id),
        inline: true,
    }, {
        name: "Message ID",
        value: (0, formatters_js_1.codeFormat)(message.id),
        inline: true,
    }, {
        name: "Learn more",
        value: "[Github](https://github.com/MrWebMD/NoSpamBot)",
        inline: false,
    })
        .setTimestamp()
        .setFooter({
        text: "Made with ❤️ by Dom#0107",
    });
};
