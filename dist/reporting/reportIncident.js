"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const incidentSummary_js_1 = __importDefault(require("../embeds/incidentSummary.js"));
/**
 *
 * @param messages List of Discord messaage objects
 * @param client Discord client object
 * @param logChannelId The id of the log channel to send reports to
 * @param incidentDescription What happened during this incident
 */
exports.default = (messages, client, logChannelId, incidentDescription) => {
    const summaryEmbed = (0, incidentSummary_js_1.default)(messages, incidentDescription);
    client.channels
        .fetch(logChannelId)
        .then((channel) => {
        if (!channel) {
            console.log("Channel has returned a null value");
            return;
        }
        channel
            .send({ embeds: [summaryEmbed] })
            .catch((err) => {
            console.log("Could not report incident", err);
        });
    })
        .catch((err) => {
        console.log("Failed to report incident", err);
    });
};
