const { messagesToTable } = require("../helpers/message-helpers.js");

/**
 * 
 * @param {Object} messageStore Redux store object 
 * @param {Object} settings Settings as defined in settings.hjson
 */
module.exports = (messageStore, settings) => {

  /**
   * Dump everything available in the message cache
   * as a table into the console
   */
  
  const messageCache = messageStore.getState();

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
