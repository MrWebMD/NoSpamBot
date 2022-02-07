const { MessageEmbed } = require("discord.js");

module.exports = (message, reason) => {

  const quarantineEmbed = new MessageEmbed()
    .setColor("#0099ff")
    .setAuthor({
      name: message.author.username + "#" + message.author.discriminator,
      iconURL: message.author.avatarURL(),
    })
    .setDescription(
      "For your safety this message has automatically been removed."
    )
    .setThumbnail("https://i.imgur.com/pJlbnwm.png")
    .setTimestamp()
    .setFooter({
      text: "Made with ❤️ by Dom#0107",
    });

  message
    .reply({ embeds: [quarantineEmbed] })
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