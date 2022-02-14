import Discord from "discord.js";
import { NoSpamSettings } from "../types";

/**
 *
 * @param message Discord message object
 * @param settings Settings as defined in settings.hjson
 */
const tempMute = (message: Discord.Message, settings: NoSpamSettings): void => {
  if (!message.member) {
    console.log("Message author is not a guild member");
    return;
  }

  const { roles } = message.member;

  const { mutedRoleId, muteTime } = settings.mitigations;

  // Don't mute the author again if they are already muted

  if (roles.cache.has(mutedRoleId)) return;

  const unmute = () =>
    roles.remove(mutedRoleId).catch((err) => {
      console.log("Could not unmute user: ", err);
    });

  // Mute the author of the message

  roles.add(mutedRoleId).catch((err) => {
    console.log("Could not mute user: ", err);
  });

  // Wait the timeout to unmute.
  // The self bot won't be able to
  // send messages in the other channels

  setTimeout(() => {
    console.log("Unmuting", message.author.username);
    unmute();
  }, muteTime);
};

module.exports = tempMute;
