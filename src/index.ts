import { Client, Message } from "discord.js";

import dotenv from "dotenv";
import messageStore from "./store/messageStore.js";
import cacheActions from "./store/actions/cacheActions.js";
import mitigationEngine from "./mitigations/mitigationEngine.js";
import readFile from "./helpers/read-file.js";
import Hjson from "hjson";
import getDiscordClient from "./discord-client.js";
import loadModules from "./loadModules.js";
import { DetectionModule, NoSpamSettings } from "./types/index.js";
import storeLogger from "./store/storeLogger.js";

dotenv.config();

const TOKEN: string = process.env.TOKEN || "";
const analyticsServerAddress: string = process.env.analyticsServerAddress || "";
const NODE_ENV: string = process.env.NODE_ENV || "";

const init = (client: Client): void => {
  if (!client.user) {
    console.log(
      "Failed to retrieve client. getDiscordClient() returned a null value client.user"
    );
    return;
  }

  console.log("Running");

  /**
   * Attempt to load settings
   */

  const settingsPath = "./settings.hjson";

  readFile(settingsPath)
    .then((settingsFileContent) => {
      if (!client.user) return;

      const settings: NoSpamSettings = Hjson.parse(settingsFileContent);

      const detectionModules = loadModules(settings.modules);

      // Set bot status

      client.user.setActivity(settings.client.status, { type: "PLAYING" });

      main(client, settings, detectionModules);
    })
    .catch((error) => {
      console.log("Failed to load settings", error);
    });
};

const main = async (
  client: Client,
  settings: NoSpamSettings,
  detectionModules: Array<DetectionModule>
): Promise<void> => {
  /**
   * Whenever the message cache updates,
   * all of the detection modules will
   * run and return an array of discord messages
   * that were flagged as spam.
   *
   * The redux store will automatically run the
   * mitigation engine, and logging functionality upon change.
   */

  messageStore.subscribe(function () {
    mitigationEngine(messageStore, settings, detectionModules, client);
  });
  messageStore.subscribe(function () {
    storeLogger(messageStore, settings);
  });

  client.on("messageCreate", (message: Message) => {
    messageCreateHandler(message, client, settings, detectionModules);
  });
};

const messageCreateHandler = (
  message: Message,
  client: Client,
  settings: NoSpamSettings,
  detectionModules: Array<DetectionModule>
) => {
  if (!client.user) {
    console.log("Client.user is a null value");
    return;
  }

  // Ignore if message was not from a guild

  if (!message.guild || !message.member) return;

  // Ignore itself

  if (message.author.id === client.user.id) return;

  // Anyone who mentions the bot gets a heart

  if (message.mentions.has(client.user.id)) message.react("❤️");

  // Ignore whitelisted users
  if (settings.cache.whitelistedUsers.includes(message.author.id)) return;

  // Ignore messages from bots

  if (message.author.bot && NODE_ENV !== "development") return;

  // Ignore messages in whitelisted channels

  if (settings.cache.whitelistedChannels.includes(message.channelId)) return;

  // Ignore messages that only contain a file (such as images since they have no text content)

  if (message.content === "" && message.attachments.size !== 0) return;

  // Ignore message if role is whitelisted

  for (var role of settings.cache.whitelistedRoles) {
    if (message.member.roles.cache.has(role)) {
      return;
    }
  }

  /**
   * All messages go in with no tags, and leave with an arrray of tags.
   * For instance, message.tags might be ["EVERYONEWITHLINKS", "DUPLICATE"].
   * By the time this message gets filtered and the store updates,
   * the mitigation engine will be able to take different actions depending
   * on the appended tags.
   *
   */

  /*  message.tags = []; */

  messageStore.dispatch(
    cacheActions.addMessage(message, settings, detectionModules)
  );
  // cacheActions.addMessage(message, settings, detectionModules)
  // const cacheMessage: CacheMessage = { message, tags: []};

  // messageStore.dispatch({
  //   type: "ADD_MESSAGE",
  //   payload: {
  //     cacheMessage,
  //     settings,
  //     detectionModules
  //   }
  // })
};

const failedToStartHandler = (error: NodeJS.ErrnoException) => {
  console.log("Failed to start: ", error);
  process.exit();
};

getDiscordClient(TOKEN).then(init).catch(failedToStartHandler);
