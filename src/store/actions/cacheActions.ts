import { Message } from "discord.js";
import { AnyAction, Action } from "redux";
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
  message: Message,
  settings: NoSpamSettings,
  detectionModules: Array<DetectionModule>
): AnyAction => {

  const cacheMessage: CacheMessage = { message, tags: []};

  const payload = { cacheMessage, settings, detectionModules }
  const action: AnyAction = {
    type: "ADD_MESSAGE",
    payload
    // payload: { cacheMessage, settings, detectionModules },
  };

  return action;
};

/**
 *
 * @returns Redux store action
 */
const flushCache = (): CacheAction => {
  const action: CacheAction = {
    type: "FLUSH_CACHE",
    payload: {},
  };

  return action;
};

export default {addMessage, flushCache}