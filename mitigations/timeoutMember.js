const timeoutMember = (member, time, reason) => {
  member
    .timeout(time, reason)
    .then(() => {
      console.log("here is who we timed out", member)
      console.log(`${member.user.username} has been timed out`);
    })
    .catch((err) => {
      console.log(`failed to timeout ${member.user.username}`)
      console.error(err);
    });
};

module.exports = timeoutMember;
