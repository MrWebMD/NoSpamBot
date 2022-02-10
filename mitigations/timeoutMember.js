/**
 * 
 * @param {Object} member Discord GuildMember object 
 * @param {Number} time Milliseconds that the member will be timed out for 
 * @param {*} reason Why this member was timed out
 */
const timeoutMember = (member, time, reason) => {
  member
    .timeout(time, reason)
    .then(() => {
      console.log(`${member.user.username} has been timed out`);
    })
    .catch((err) => {
      console.log(`failed to timeout ${member.user.username}`)
      console.error(err);
    });
};

module.exports = timeoutMember;
