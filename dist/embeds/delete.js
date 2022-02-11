"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
/**
 * Delete a message from a guild channel and display a message embed
 * @param message Discord message object
 * @param reason Why this message was removed
 * @returns Discord MessageEmbed object
 */
exports.default = (cacheMessage, reason) => {
    const { message } = cacheMessage;
    const color = "#d82a31";
    const authorTag = `${message.author.username}#${message.author.discriminator}`;
    const iconURL = message.author.avatarURL() || "";
    const thumbnail = "https://i.imgur.com/pJlbnwm.png";
    const embed = new discord_js_1.MessageEmbed();
    return embed
        .setColor(color)
        .setAuthor({
        name: authorTag,
        iconURL,
    })
        .setDescription(reason)
        .setThumbnail(thumbnail)
        .setTimestamp()
        .addFields({
        name: "Learn more",
        value: "[Github](https://github.com/MrWebMD/NoSpamBot)",
        inline: false,
    })
        .setFooter({
        text: "Made with ❤️ by Dom#0107",
    });
};
