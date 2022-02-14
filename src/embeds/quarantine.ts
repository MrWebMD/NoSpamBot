import Discord from "discord.js";
import {
  defangMessageLinks,
  getAuthorTag,
} from "../helpers/message-helpers.js";
import { codeFormat } from "../helpers/formatters.js";
import { CacheMessage } from "../types";

/**
 * Generate a quarantine embed for a given message
 * @param message Discord message object
 * @param reason Overview of what happened, will be used as the header for the embed
 * @param description Why this message was quarantined, will be used for extra details
 * @returns Discord MessageEmbed object
 */
export default (
  cacheMessage: CacheMessage,
  reason: string,
  description: string
): Discord.MessageEmbed => {

  const {message} = cacheMessage;

  const previewText = defangMessageLinks(message).substr(0, 150) + "...";

  const title = "NoSpam quarantined this message";

  const color = "#0099ff";

  const authorTag = getAuthorTag(message);

  const iconURL = message.author.avatarURL() || "";

  const thumbnail = "https://i.imgur.com/dRI2bdJ_d.webp";

  return new Discord.MessageEmbed()
    .setColor(color)
    .setTitle(title)
    .setAuthor({
      name: authorTag,
      iconURL,
    })
    .setDescription(reason)
    .setThumbnail(thumbnail)
    .addFields(
      {
        name: "Defanged preview",
        value: codeFormat(previewText),
      },
      {
        name: "Description",
        value: codeFormat(description),
      },
      {
        name: "Tags",
        value: codeFormat(cacheMessage.tags.join(", ")),
      },
      {
        name: "Author ID",
        value: codeFormat(message.author.id),
        inline: true,
      },
      {
        name: "Message ID",
        value: codeFormat(message.id),
        inline: true,
      },
      {
        name: "Learn more",
        value: "[Github](https://github.com/MrWebMD/NoSpamBot)",
        inline: false,
      }
    )
    .setTimestamp()
    .setFooter({
      text: "Made with ❤️ by Dom#0107",
    });
};
