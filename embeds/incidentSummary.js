const { MessageEmbed } = require("discord.js");
const { tagFormat, codeFormat } = require("../helpers/formatters.js");
const {
  defangMessageLinks,
  getAuthorTag,
} = require("../helpers/message-helpers.js");

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
 * @param {Array} messages List of Discord message objects
 * @param {*} incidentDescription Why these messages were removed 
 * @returns {MessageEmbed} Discord MessageEmbed object
 */
module.exports = (messages, incidentDescription) => {
  var title = (messages.length > 1 ? "Combined " : "") + "Incident Report";

  const color = "#03326d";

  const thumbnail = "https://i.imgur.com/jiecmUR.png";

  const embedFields = [];

  messages.forEach((message) => {
    embedFields.push(...getIncidentFieldsForSingleIncident(message));
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
 * 
 * @param {Object} message Discord Message object 
 * @returns Array of embed fields
 */
const getIncidentFieldsForSingleIncident = (message) => {
  var fields = [];

  fields.push({
    name: "Author",
    value: getAuthorTag(message),
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
    value: tagFormat(message.tags),
    inline: false,
  });
  fields.push({
    name: "\u200B",
    value: "\u200B",
    inline: false,
  });

  return fields;
};
