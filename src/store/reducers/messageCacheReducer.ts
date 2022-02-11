import { Reducer, AnyAction } from "redux";
import {
  CacheMessage,
  CacheMessages,
  DetectionModule,
  NoSpamSettings,
} from "../../types/index.js";

import {
  removeOldMessages,
  tagMessage,
} from "../../helpers/message-helpers.js";

const messageCacheReducer: Reducer = (
  state = { messages: [], flaggedMessages: [] },
  action: AnyAction
) => {
  var { messages, flaggedMessages } = state;

  if (action.type === "FLUSH_CACHE") {
    return { messages: [], flaggedMessages: [] };
  }

  if (action.type === "ADD_MESSAGE") {
    var newMessages: CacheMessages = [...messages];
    var newFlaggedMessages: CacheMessages = [...flaggedMessages];

    const settings: NoSpamSettings = action.payload.settings;

    const newCacheMessage: CacheMessage = action.payload.cacheMessage;

    const detectionModules: Array<DetectionModule> =
      action.payload.detectionModules;

    /**
     * Aging the cache by filtering out messages that are older
     * that the max age.
     */

    newMessages = removeOldMessages(newMessages, settings.cache.maxAge);

    newFlaggedMessages = removeOldMessages(
      newFlaggedMessages,
      settings.cache.maxAge
    );

    // Add the newest message to the cache.

    newMessages.push(newCacheMessage);

    const sortedDetectionModules = detectionModules.sort(
      (module1, module2) => module1.detectionOrder - module2.detectionOrder
    );

    for (let detectionModule of sortedDetectionModules) {
      newMessages = detectionModule.main(
        newMessages,
        newFlaggedMessages,
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

    newFlaggedMessages = [
      // previously processed flagged messages get archived
      ...newFlaggedMessages.map((cacheMessage) => {
        tagMessage(cacheMessage, "ARCHIVED");
        return cacheMessage;
      }),
      // newly processed and flagged messages won't have the archive tag.
      // but when they get processed again they will
      ...newMessages.filter((cacheMessage) => cacheMessage.tags.length > 0),
    ];

    /**
     * Remove the messages already flagged out of the cached
     * messages array so we don't analyze them again.
     */

    const flaggedMessageIDs = newFlaggedMessages.map(
      (flaggedMessage) => flaggedMessage.message.id
    );

    newMessages = newMessages.filter((cacheMessage) => {
      return !flaggedMessageIDs.includes(cacheMessage.message.id);
    });

    // Pass the updated state back to the Redux store.

    return {
      messages: newMessages,
      flaggedMessages: newFlaggedMessages,
    };
  }
  return state;
};

export default messageCacheReducer;
