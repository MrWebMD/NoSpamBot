import { CacheMessage } from "../types";

/**
 * Delete a message from a channel without any feedback on what happened
 * @param message Discord message object
 */
export default (cacheMessage: CacheMessage): void => {
  cacheMessage.message
    .delete()
    .then((message) =>
      console.log(`Deleted message from ${message.author.username}`)
    )
    .catch(console.log);
};
