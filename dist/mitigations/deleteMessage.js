"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delete_js_1 = __importDefault(require("../embeds/delete.js"));
/**
 * Delete a discord message from a channel and leave a message embed
 * with details on why
 * @param message Discord message object
 * @param reason Why this message was deleted
 */
exports.default = (cacheMessage, reason) => {
    const deleteEmbed = (0, delete_js_1.default)(cacheMessage, reason);
    cacheMessage.message
        .reply({ embeds: [deleteEmbed] })
        .then(() => {
        console.log("Warning has been issued");
        cacheMessage.message
            .delete()
            .then((message) => console.log(`Deleted message from ${message.author.username}`))
            .catch(console.log);
    })
        .catch(console.log);
};
