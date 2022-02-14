import Discord from "discord.js";

interface MessageCacheState {
  messages: CacheMessages;
  flaggedMessages: CacheMessages;
}

interface CacheMessage {
  tags: string[];
  message: Discord.Message
}

type CacheMessages = Array<CacheMessage>;

/**
 * Cache Action options for the redux message cache/store
 */
interface CacheAction {
  /**
   * @property Name of the action to be taken
   */
  type: string;
  /**
   * @property Data to be used with the action
   */
  payload: any;
}

type NoSpamModuleOptionTypes = boolean | string | number;

interface NoSpamModuleOptions {
  tag: string;
  [index: string]: NoSpamModuleOptionTypes;
}

interface DetectionModuleSettings {
  name: string;
  path: string;
  detectionOrder: number;
  mitigationOrder: number;
  options: NoSpamModuleOptions;
  
}

interface DetectionModule extends DetectionModuleSettings {
  main(messages: CacheMessages, previouslyFlaggedMessages: CacheMessages, moduleOptions: NoSpamModuleOptions);
  mitigation(messages: CacheMessages, settings: NoSpamSettings, client: Discord.Client): void;
}

interface NoSpamSettings {
  client: {
    status: string;
  };
  reporting: {
    logChannelId: string;
  };
  mitigations: {
    mutedRoleId: string;
    muteTime: number;
  };
  cache: {
    maxAge: number;
    whitelistedChannels: Array<string>;
    whitelistedRoles: Array<string>;
    whitelistedUsers: Array<string>;
  };
  modules: Array<DetectionModuleSettings>
}
