const deleteEmbedCreator = require('../embeds/delete.js');

/**
 * 
 * @param {Object} message Discord message object 
 * @param {String} reason Why this message was deleted
 */
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
            `Deleted message from ${message.author.username}`
          )
        )
        .catch(console.log);
    })
    .catch(console.log);
};
