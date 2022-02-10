const quarantineEmbedCreator = require("../embeds/quarantine");

/**
 * 
 * @param {Object} message Discord message object 
 * @param {String} reason Overview of what happened
 * @param {String} description Why this message was quarantined
 */
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
