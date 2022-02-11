import { Store } from "redux";
import { MessageCacheState, NoSpamSettings } from "../types";

import { messagesToTable } from "../helpers/message-helpers.js";

/**
 * 
 * @param {Object} messageStore Redux store object 
 * @param {Object} settings Settings as defined in settings.hjson
 */
export default (messageStore: Store, settings: NoSpamSettings): void => {

  /**
   * Dump everything available in the message cache
   * as a table into the console
   */
  
  const messageCache:MessageCacheState = messageStore.getState();

  console.log("here is the current cache", messageCache);

  const totalMessagesCached =
    messageCache.messages.length + messageCache.flaggedMessages.length;

  console.clear();

  console.log(
    `Total Messages Cached: ${totalMessagesCached}, Cache TTL: ${Math.floor(
      settings.cache.maxAge / 1000
    )}s`
  );

  messagesToTable(messageCache.messages);

  console.log("Flagged Messages");

  messagesToTable(messageCache.flaggedMessages);
};
