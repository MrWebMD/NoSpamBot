const { Client, Intents } = require("discord.js");

const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES];

const client = new Client({
  intents,
});

const getDiscordClient = (TOKEN) => {
  return new Promise((resolve, reject) => {

    client.on("ready", () => {
      
      resolve(client);
      
    });

    client.login(TOKEN).catch(reject);
  });
};

module.exports = getDiscordClient;
