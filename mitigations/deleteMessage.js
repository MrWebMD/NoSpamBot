const deleteEmbedCreator = require('../embeds/delete.js');
module.exports = (message, reason) => {
  
  const deleteEmbed = deleteEmbedCreator(message, reason);

  message
    .reply({ embeds: [deleteEmbed] })
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
