"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quarantineEmbedCreator = require("../embeds/quarantine");
/**
 *
 * @param message Discord message object
 * @param reason Overview of what happened
 * @param description Why this message was quarantined
 */
module.exports = (cacheMessage, reason, description) => {
    console.log("Quarantine");
    const { message } = cacheMessage;
    const quarantineEmbed = quarantineEmbedCreator(message, reason, description);
    message
        .reply({ embeds: [quarantineEmbed] })
        .then(() => {
        console.log("Warning has been issued");
        message
            .delete()
            .then((message) => console.log(`Deleted quarantined message from ${message.author.username}`))
            .catch(console.log);
    })
        .catch(console.log);
};
