"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * React to a message with a little flag
 * @param {Object} message Discord message object
 */
module.exports = (cacheMessage) => {
    cacheMessage.message.react("🚩");
};
