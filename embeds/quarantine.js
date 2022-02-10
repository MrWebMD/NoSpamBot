const { MessageEmbed } = require("discord.js");
const { defangMessageLinks, getAuthorTag } = require("../helpers/message-helpers.js");
const { codeFormat } = require("../helpers/formatters.js");

/**
 * 
 * @param {Object} message Discord message object 
 * @param {String} reason Overview of what happened
 * @param {String} description Why this message was quarantined
 * @returns {MessageEmbed} Discord MessageEmbed object
 */
module.exports = (message, reason, description) => {
  const previewText = defangMessageLinks(message).substr(0, 150) + "...";

  const title = "NoSpam quarantined this message";

  const color = "#0099ff";

  const authorTag = getAuthorTag(message);

  const iconURL = message.author.avatarURL();

  const thumbnail = "https://i.imgur.com/dRI2bdJ_d.webp";

  return new MessageEmbed()
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
        value: codeFormat(message.tags.join(", ")),
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
