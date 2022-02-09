const { MessageEmbed } = require("discord.js");

module.exports = (message, reason) => {
  const color = "#d82a31";

  const authorTag = `${message.author.username}#${message.author.discriminator}`;

  const iconURL = message.author.avatarURL();

  const thumbnail = "https://i.imgur.com/pJlbnwm.png";
  return new MessageEmbed()
    .setColor(color)
    .setAuthor({
      name: authorTag,
      iconURL,
    })
    .setDescription(reason)
    .setThumbnail(thumbnail)
    .setTimestamp()
    .addFields(
      {
        name: "Learn more",
        value: "[Github](https://github.com/MrWebMD/NoSpamBot)",
        inline: false,
      }
    )
    .setFooter({
      text: "Made with ❤️ by Dom#0107",
    })
};
