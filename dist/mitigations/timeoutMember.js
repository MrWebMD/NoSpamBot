"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Issue a timeout to the guild member for a period of time. They
 * will not be able to send message.
 * @param member Discord GuildMember object
 * @param time Milliseconds that the member will be timed out for
 * @param reason Why this member was timed out
 */
const timeoutMember = (member, time, reason) => {
    member
        .timeout(time, reason)
        .then(() => {
        console.log(`${member.user.username} has been timed out`);
    })
        .catch((err) => {
        console.log(`failed to timeout ${member.user.username}`);
        console.error(err);
    });
};
exports.default = timeoutMember;
