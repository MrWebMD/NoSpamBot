"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_helpers_js_1 = require("../../helpers/message-helpers.js");
const messageCacheReducer = (state = { messages: [], flaggedMessages: [] }, action) => {
    var { messages, flaggedMessages } = state;
    if (action.type === "FLUSH_CACHE") {
        return { messages: [], flaggedMessages: [] };
    }
    if (action.type === "ADD_MESSAGE") {
        var newMessages = [...messages];
        var newFlaggedMessages = [...flaggedMessages];
        const settings = action.payload.settings;
        const newCacheMessage = action.payload.cacheMessage;
        const detectionModules = action.payload.detectionModules;
        /**
         * Aging the cache by filtering out messages that are older
         * that the max age.
         */
        newMessages = (0, message_helpers_js_1.removeOldMessages)(newMessages, settings.cache.maxAge);
        newFlaggedMessages = (0, message_helpers_js_1.removeOldMessages)(newFlaggedMessages, settings.cache.maxAge);
        // Add the newest message to the cache.
        newMessages.push(newCacheMessage);
        const sortedDetectionModules = detectionModules.sort((module1, module2) => module1.detectionOrder - module2.detectionOrder);
        for (let detectionModule of sortedDetectionModules) {
            newMessages = detectionModule.main(newMessages, newFlaggedMessages, detectionModule.options);
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
                (0, message_helpers_js_1.tagMessage)(cacheMessage, "ARCHIVED");
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
        const flaggedMessageIDs = newFlaggedMessages.map((flaggedMessage) => flaggedMessage.message.id);
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
exports.default = messageCacheReducer;
