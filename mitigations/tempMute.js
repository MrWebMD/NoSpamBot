const tempMute = (message, settings) => {

  const { roles } = message.member;

  const { mutedRoleId, muteTime } = settings.mitigations;

  // Don't mute the author again if they are already muted

  if(roles.cache.has(mutedRoleId)) return;

  const unmute = () => roles.remove(mutedRoleId);

  // Mute the author of the message

  roles.add(mutedRoleId);

  // Wait the timeout to unmute.
  // The self bot won't be able to 
  // send messages in the other channels

  setTimeout(() => {
    console.log("Unmuting", message.author.username);
    unmute(message);
  }, muteTime)

};

module.exports = tempMute;
