import { Client, TextChannel } from "discord.js";
import incidentSummaryEmbedCreator from "../embeds/incidentSummary.js";
import { CacheMessages } from "../types/index.js";

/**
 *
 * @param {Array} messages List of Discord messaage objects
 * @param {Object} client Discord client object
 * @param {String} logChannelId The id of the log channel to send reports to
 * @param {String} incidentDescription What happened during this incident
 */
export default (
  messages: CacheMessages,
  client: Client,
  logChannelId: string,
  incidentDescription: string
): void => {
  const summaryEmbed = incidentSummaryEmbedCreator(
    messages,
    incidentDescription
  );

  client.channels
    .fetch(logChannelId)
    .then((channel) => {
      if (!channel) {
        console.log("Channel has returned a null value");
        return;
      }

      (channel as TextChannel)
        .send({ embeds: [summaryEmbed] })
        .catch((err: NodeJS.ErrnoException) => {
          console.log("Could not report incident", err);
        });
    })
    .catch((err) => {
      console.log("Failed to report incident", err);
    });
};
