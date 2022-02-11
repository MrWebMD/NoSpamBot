import { CacheMessage } from "../types";

/**
 * React to a message with a little flag
 * @param {Object} message Discord message object 
 */
module.exports = (cacheMessage: CacheMessage): void => {
  cacheMessage.message.react("🚩");
}