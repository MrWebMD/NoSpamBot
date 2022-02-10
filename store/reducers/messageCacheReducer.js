const {
  removeOldMessages,
  tagMessage,
} = require("../../helpers/message-helpers.js");

module.exports = (state = { messages: [], flaggedMessages: [] }, action) => {
  var { messages, flaggedMessages } = state;

  if (action.type === "FLUSH_CACHE") {
    return { messages: [], flaggedMessages: [] };
  }

  if (action.type === "ADD_MESSAGE") {
    const { settings, message: newMessage, detectionModules } = action.payload;

    /**
     * Aging the cache by filtering out messages that are older
     * that the max age.
     */
    
    messages = removeOldMessages(messages, settings.cache.maxAge);

    flaggedMessages = removeOldMessages(flaggedMessages, settings.cache.maxAge);

    // Add the newest message to the cache.

    messages.push(newMessage);

    const sortedDetectionModules = detectionModules.sort(
      (module1, module2) => module1.detectionOrder - module2.detectionOrder
    );
    
    for (let detectionModule of sortedDetectionModules) {

      messages = detectionModule.main(
        messages,
        flaggedMessages,
        detectionModule.options
      );
    }

    /**
     * Messaged marked with ARCHIVED mean that
     * Action will/has been taken against them.
     * So when those flagged messages are processed
     * again the bot wont re-complete its actions
     * on the message.
     */

    flaggedMessages = [
      // previously processed flagged messages get archived
      ...flaggedMessages.map((message) => {
        tagMessage(message, "ARCHIVED");
        return message;
      }),
      // newly processed and flagged messages won't have the archive tag.
      // but when they get processed again they will
      ...messages.filter((message) => message.tags.length > 0),
    ];

    /**
     * Remove the messages already flagged out of the cached
     * messages array so we don't analyze them again.
     */

    const flaggedMessageIDs = flaggedMessages.map(
      (flaggedMessage) => flaggedMessage.id
    );

    messages = messages.filter((message) => {
      return !flaggedMessageIDs.includes(message.id);
    });

    // Pass the updated state back to the Redux store.

    return { messages, flaggedMessages };
  }
  return state;
};
