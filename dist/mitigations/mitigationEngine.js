"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get the newly updated flagged messages array from
 * the store and give the appropriate response
 */
/**
 *
 * @param messageStore Redux store object
 * @param settings Settings object as defined in settings.hjson
 * @param detectionModules A list of the required modules from the detection-modules folder
 * @param client Discord client object
 */
const mitigationEngine = (messageStore, settings, detectionModules, client) => {
    // Retrieve all available data from the message cache.
    const messageCache = messageStore.getState();
    var messagesAddressed = [];
    /**
     * The mitigation engine will execute mitigation efforts
     * in the order specified. Some modules like "mentionsEveryoneWithLinks"
     * will usually pick up phishing links from self bots and should
     * therefore have the highest priorty when actions need to be taken.
     */
    const sortedDetectionModules = detectionModules.sort((module1, module2) => module1.mitigationOrder - module2.mitigationOrder);
    /**
     * Every message in this array of discord message objects
     * now has a new property named "tags". It is an array
     * of strings containing single word descriptions from
     * the module that detected it.
     * Some examples include "DUPLICATE" and "EVERYONEWITHLINKS"
     */
    for (let detectionModule of sortedDetectionModules) {
        var moduleTaggedMessages = messageCache.flaggedMessages.filter((cacheMessage) => cacheMessage.tags.includes(detectionModule.options.tag) &&
            !messagesAddressed.includes(cacheMessage.message.id) &&
            !cacheMessage.tags.includes("ARCHIVED"));
        messagesAddressed.push(...moduleTaggedMessages.map((m) => m.message.id));
        /**
         * If the current detection modules has messages to handle then pass
         * the messages to it.
         */
        if (moduleTaggedMessages.length > 0) {
            detectionModule.mitigation(moduleTaggedMessages, settings, client);
        }
    }
};
exports.default = mitigationEngine;
