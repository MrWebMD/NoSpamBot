import { Client, Intents } from "discord.js";

const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES];

const client = new Client({
  intents,
});
/**
 * 
 * @param TOKEN Discord bot token 
 * @returns Promise with the Discord client object
 */
const getDiscordClient = (TOKEN: string): Promise<Client> => {
  return new Promise((resolve, reject) => {

    client.on("ready", () => {
      
      resolve(client);
      
    });

    client.login(TOKEN).catch(reject);
  });
};

export default getDiscordClient;
