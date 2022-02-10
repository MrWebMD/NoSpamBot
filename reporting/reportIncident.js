const incidentSummaryEmbedCreator = require("../embeds/incidentSummary.js");

/**
 *
 * @param {Array} messages List of Discord messaage objects
 * @param {Object} client Discord client object
 * @param {String} logChannelId The id of the log channel to send reports to
 * @param {String} incidentDescription What happened during this incident
 */
module.exports = (messages, client, logChannelId, incidentDescription) => {
  
  const summaryEmbed = incidentSummaryEmbedCreator(
    messages,
    incidentDescription
  );

  client.channels
    .fetch(logChannelId)
    .then((channel) => {
      channel.send({ embeds: [summaryEmbed] }).catch((err) => {
        console.log("Could not report incident", err);
      });
    })
    .catch((err) => {
      console.log("Failed to report incident", err);
    });
};
