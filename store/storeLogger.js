const { getMessageAge } = require("../helpers/message-helpers.js");

const msToSeconds = (ms) => Math.floor(ms / 1000);

const messagesToTable = (messages) => {
  /**
   * Logs out an array of processed
   * messages as an array to the console
   */
  console.log("");
  console.table(
    messages.map((message) => {
      return {
        TAGS: message.tags.join(","),
        CONTENT: message.content.substr(0, 15) + "...",
        ID: message.id,
        AGE: msToSeconds(getMessageAge(message)) + "s",
      };
    })
  );
  console.log("");
};

module.exports = (messageStore, settings) => {
  const messageCache = messageStore.getState();

  const totalMessagesCached =
    messageCache.messages.length + messageCache.flaggedMessages.length;

  console.clear();

  console.log(
    `Total Messages Cached: ${totalMessagesCached}, Cache TTL: ${msToSeconds(
      settings.cache.maxAge
    )}s`
  );

  messagesToTable(messageCache.messages);

  console.log("Flagged Messages");

  messagesToTable(messageCache.flaggedMessages);
};
