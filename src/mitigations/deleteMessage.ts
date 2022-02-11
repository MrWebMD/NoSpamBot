import { CacheMessage } from "../types";

import deleteEmbedCreator from '../embeds/delete.js';

/**
 * Delete a discord message from a channel and leave a message embed
 * with details on why
 * @param message Discord message object 
 * @param reason Why this message was deleted
 */
export default (cacheMessage: CacheMessage, reason: string): void => {
  
  const deleteEmbed = deleteEmbedCreator(cacheMessage, reason);

  cacheMessage.message
    .reply({ embeds: [deleteEmbed] })
    .then(() => {
      console.log("Warning has been issued");
      cacheMessage.message
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
