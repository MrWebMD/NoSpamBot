"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Delete a message from a channel without any feedback on what happened
 * @param message Discord message object
 */
exports.default = (cacheMessage) => {
    cacheMessage.message
        .delete()
        .then((message) => console.log(`Deleted message from ${message.author.username}`))
        .catch(console.log);
};
