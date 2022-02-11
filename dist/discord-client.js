"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const intents = [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES];
const client = new discord_js_1.Client({
    intents,
});
/**
 *
 * @param TOKEN Discord bot token
 * @returns Promise with the Discord client object
 */
const getDiscordClient = (TOKEN) => {
    return new Promise((resolve, reject) => {
        client.on("ready", () => {
            resolve(client);
        });
        client.login(TOKEN).catch(reject);
    });
};
exports.default = getDiscordClient;
