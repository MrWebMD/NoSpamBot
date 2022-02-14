import Discord from "discord.js";
import { AnyAction } from "redux";
import {
  CacheAction,
  CacheMessage,
  DetectionModule,
  NoSpamSettings,
} from "../../types";


/**
 * Action creator for adding messages to the cache
 * @param message Discord message object
 * @param settings Settings as defined in settings.hjson
 * @param detectionModules A list of the required modules from the detection-modules folder
 * @returns Redux store action
 */
const addMessage = (
  message: Discord.Message,
  settings: NoSpamSettings,
  detectionModules: Array<DetectionModule>
): AnyAction => {

  const cacheMessage: CacheMessage = { message, tags: []};

  const payload = { cacheMessage, settings, detectionModules }
  const action: AnyAction = {
    type: "ADD_MESSAGE",
    payload
  };

  return action;
};

/**
 *
 * @returns Redux store action
 */
const flushCache = (): AnyAction => {
  const action: AnyAction = {
    type: "FLUSH_CACHE",
    payload: {},
  };

  return action;
};

export default {addMessage, flushCache}