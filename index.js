const dotenv = require("dotenv");
const messageStore = require("./store/messageStore.js");
const storeLogger = require('./store/storeLogger.js');
const cacheActions = require("./store/actions/cacheActions.js");
const mitigationEngine = require("./mitigations/mitigationEngine.js");
const readFile = require("./helpers/read-file.js");
const Hjson = require("hjson");
const getDiscordClient = require("./discord-client.js");

dotenv.config();

const { TOKEN, NODE_ENV } = process.env;

const main = async (client) => {
  console.log("Running");

  /**
   * Attempt to load settings
   */

  const settingsPath = "./settings.hjson";

  const [settingsFileContent, error] = await readFile(settingsPath);

  if (error) {
    console.log("Failed to load settings", error);
    return;
  }

  const settings = Hjson.parse(settingsFileContent);

  /**
   * Whenever the message cache updates,
   * all of the detection modules will
   * run and return an array of discord messages
   * that were flagged as spam.
   *
   * The redux store will automatically run the
   * mitigation engine, and logging functionality upon change.
   */

  messageStore.subscribe(mitigationEngine.bind(this, messageStore, settings));
  messageStore.subscribe(storeLogger.bind(this, messageStore, settings));
  client.on("messageCreate", (message) => {
    messageCreateHandler(message, client, settings);
  });
};

const messageCreateHandler = (message, client, settings) => {
  // Ignore if message was not from a guild

  if (!message.guild) return;

  // Ignore itself

  if (message.author.id === client.user.id) return;

  // Ignore whitelisted users
  if (settings.cache.whitelistedUsers.includes(message.author.id)) return;

  // Ignore messages from bots

  if (message.author.bot && NODE_ENV !== "development") return;

  // Ignore messages in whitelisted channels

  if (settings.cache.whitelistedChannels.includes(message.channelId)) return;

  // Ignore message if role is whitelisted

  for (role of settings.cache.whitelistedRoles) {
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

  message.tags = [];

  messageStore.dispatch(cacheActions.addMessage(message, settings));
};

const failedToStartHandler = (error) => {
  console.log("Failed to start: ", error);
  process.exit();
};

getDiscordClient(TOKEN).then(main).catch(failedToStartHandler);
