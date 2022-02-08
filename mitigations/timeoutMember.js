const timeoutMember = (member, time, reason) => {
  member.timeout(time, reason).then(console.log).catch(console.error);
};

module.exports = timeoutMember;
