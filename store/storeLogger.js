const { messagesToTable } = require("../helpers/message-helpers.js");

module.exports = (messageStore, settings) => {
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
