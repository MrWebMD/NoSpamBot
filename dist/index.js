"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const messageStore_js_1 = __importDefault(require("./store/messageStore.js"));
const cacheActions_js_1 = __importDefault(require("./store/actions/cacheActions.js"));
const mitigationEngine_js_1 = __importDefault(require("./mitigations/mitigationEngine.js"));
const read_file_js_1 = __importDefault(require("./helpers/read-file.js"));
const hjson_1 = __importDefault(require("hjson"));
const discord_client_js_1 = __importDefault(require("./discord-client.js"));
const loadModules_js_1 = __importDefault(require("./loadModules.js"));
const storeLogger_js_1 = __importDefault(require("./store/storeLogger.js"));
dotenv_1.default.config();
const TOKEN = process.env.TOKEN || "";
const analyticsServerAddress = process.env.analyticsServerAddress || "";
const NODE_ENV = process.env.NODE_ENV || "";
const init = (client) => {
    if (!client.user) {
        console.log("Failed to retrieve client. getDiscordClient() returned a null value client.user");
        return;
    }
    console.log("Running");
    /**
     * Attempt to load settings
     */
    const settingsPath = "./settings.hjson";
    (0, read_file_js_1.default)(settingsPath)
        .then((settingsFileContent) => {
        if (!client.user)
            return;
        const settings = hjson_1.default.parse(settingsFileContent);
        const detectionModules = (0, loadModules_js_1.default)(settings.modules);
        // Set bot status
        client.user.setActivity(settings.client.status, { type: "PLAYING" });
        main(client, settings, detectionModules);
    })
        .catch((error) => {
        console.log("Failed to load settings", error);
    });
};
const main = (client, settings, detectionModules) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Whenever the message cache updates,
     * all of the detection modules will
     * run and return an array of discord messages
     * that were flagged as spam.
     *
     * The redux store will automatically run the
     * mitigation engine, and logging functionality upon change.
     */
    messageStore_js_1.default.subscribe(function () {
        (0, mitigationEngine_js_1.default)(messageStore_js_1.default, settings, detectionModules, client);
    });
    messageStore_js_1.default.subscribe(function () {
        (0, storeLogger_js_1.default)(messageStore_js_1.default, settings);
    });
    client.on("messageCreate", (message) => {
        messageCreateHandler(message, client, settings, detectionModules);
    });
});
const messageCreateHandler = (message, client, settings, detectionModules) => {
    if (!client.user) {
        console.log("Client.user is a null value");
        return;
    }
    // Ignore if message was not from a guild
    if (!message.guild || !message.member)
        return;
    // Ignore itself
    if (message.author.id === client.user.id)
        return;
    // Anyone who mentions the bot gets a heart
    if (message.mentions.has(client.user.id))
        message.react("❤️");
    // Ignore whitelisted users
    if (settings.cache.whitelistedUsers.includes(message.author.id))
        return;
    // Ignore messages from bots
    if (message.author.bot && NODE_ENV !== "development")
        return;
    // Ignore messages in whitelisted channels
    if (settings.cache.whitelistedChannels.includes(message.channelId))
        return;
    // Ignore messages that only contain a file (such as images since they have no text content)
    if (message.content === "" && message.attachments.size !== 0)
        return;
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
    messageStore_js_1.default.dispatch(cacheActions_js_1.default.addMessage(message, settings, detectionModules));
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
const failedToStartHandler = (error) => {
    console.log("Failed to start: ", error);
    process.exit();
};
(0, discord_client_js_1.default)(TOKEN).then(init).catch(failedToStartHandler);
