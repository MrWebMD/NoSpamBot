import Discord from "discord.js";
import { CacheMessage } from "../types";

/**
 * Delete a message from a guild channel and display a message embed
 * @param message Discord message object
 * @param reason Why this message was removed
 * @returns Discord MessageEmbed object
 */
export default (cacheMessage: CacheMessage, reason: string): Discord.MessageEmbed => {
  const { message } = cacheMessage;

  const color = "#d82a31";

  const authorTag = `${message.author.username}#${message.author.discriminator}`;

  const iconURL: string = message.author.avatarURL() || "";

  const thumbnail = "https://i.imgur.com/pJlbnwm.png";

  const embed = new Discord.MessageEmbed();

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
