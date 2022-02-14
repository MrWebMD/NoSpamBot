"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_helpers_js_1 = require("../helpers/message-helpers.js");
/**
 *
 * @param messageStore Redux store object
 * @param settings Settings as defined in settings.hjson
 */
exports.default = (messageStore, settings) => {
    /**
     * Dump everything available in the message cache
     * as a table into the console
     */
    const messageCache = messageStore.getState();
    console.log("here is the current cache", messageCache);
    const totalMessagesCached = messageCache.messages.length + messageCache.flaggedMessages.length;
    console.clear();
    console.log(`Total Messages Cached: ${totalMessagesCached}, Cache TTL: ${Math.floor(settings.cache.maxAge / 1000)}s`);
    (0, message_helpers_js_1.messagesToTable)(messageCache.messages);
    console.log("Flagged Messages");
    (0, message_helpers_js_1.messagesToTable)(messageCache.flaggedMessages);
};
