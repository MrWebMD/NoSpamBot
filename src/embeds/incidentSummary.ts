import { CacheMessages, CacheMessage } from "../types";
import { EmbedFieldData, MessageEmbed } from "discord.js";
import { tagFormat, codeFormat } from "../helpers/formatters";
import {
  defangMessageLinks,
  getAuthorTag,
} from "../helpers/message-helpers.js";

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
export default (
  messages: CacheMessages,
  incidentDescription: string
): MessageEmbed => {
  var title = (messages.length > 1 ? "Combined " : "") + "Incident Report";

  const color = "#03326d";

  const thumbnail = "https://i.imgur.com/jiecmUR.png";

  var embedFields: Array<EmbedFieldData> = [];

  messages.forEach((cacheMessage) => {
    embedFields.push(...getIncidentFieldsForSingleIncident(cacheMessage));
  });

  return new MessageEmbed()
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
const getIncidentFieldsForSingleIncident = (
  cacheMessage: CacheMessage
): Array<EmbedFieldData> => {
  const { message } = cacheMessage;

  var fields: Array<EmbedFieldData> = [];

  fields.push({
    name: "Author",
    value: getAuthorTag(cacheMessage.message),
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
    value: codeFormat(defangMessageLinks(message).substr(0, 150) + "..."),
    inline: false,
  });

  fields.push({
    name: "Tags",
    value: tagFormat(cacheMessage.tags),
    inline: false,
  });
  fields.push({
    name: "\u200B",
    value: "\u200B",
    inline: false,
  });

  return fields;
};
