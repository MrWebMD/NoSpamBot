const quarantineEmbedCreator = require("../embeds/quarantine");

module.exports = (message, reason, description) => {
  console.log("Quarantine");

  const quarantineEmbed = quarantineEmbedCreator(message, reason, description);

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
