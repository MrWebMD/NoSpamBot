const { MessageEmbed } = require("discord.js");
const {
  defangMessageLinks,
  getMessageLinks,
} = require("../helpers/message-helpers.js");

module.exports = (message, reason) => {
  console.log("Quarantine");

  const codeFormat = (str) => "```" + str + "```";

  var previewText = defangMessageLinks(message).substr(0, 150) + "...";

  const messageLinks = getMessageLinks(message);

  for (link of messageLinks) {
    var thirdLinkLength = Math.floor(link.length / 3);
    var thirdOfLink = link.substr(thirdLinkLength, thirdLinkLength);
    var newLink = link.replaceAll(thirdOfLink, ".".repeat(thirdLinkLength));

    previewText = previewText.replaceAll(link, newLink);
  }

  const exampleEmbed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("NoSpam quarantined this message")
    .setAuthor({
      name: message.author.username + "#" + message.author.discriminator,
      iconURL: message.author.avatarURL(),
    })
    .setDescription(
      codeFormat("For your safety this message has automatically been removed.")
    )
    .setThumbnail("https://i.imgur.com/dRI2bdJ_d.webp")
    .addFields(
      { name: "Defanged preview", value: codeFormat(previewText) },
      { name: "Description", value: codeFormat(reason) },
      { name: "Tags", value: codeFormat(message.tags.join(", ")) },
      // { name: "\u200B", value: "\u200B" },
      { name: "Author ID", value: codeFormat(message.author.id), inline: true },
      { name: "Message ID", value: codeFormat(message.id), inline: true }
    )
    .setTimestamp()
    .setFooter({
      text: "Made with ❤️ by Dom#0107",
    });

  message
    .reply({ embeds: [exampleEmbed] })
    .then(() => {
      console.log("Warning has been issued");
      message
        .delete()
        .then((message) =>
          console.log(
            `Deleted quarantined message from ${message.author.username}`
          )
        )
        .catch(console.log);
    })
    .catch(console.log);
};
