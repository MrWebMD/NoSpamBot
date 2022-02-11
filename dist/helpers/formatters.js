"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.durationFormat = exports.pluralFormat = exports.authorListFormat = exports.tagFormat = exports.codeFormat = void 0;
/**
 * Create a code block automatically. Wrap strings with backticks.
 * @param str Content to wrap into a code block
 * @returns Content wrapped in backticks
 */
const codeFormat = (str) => "```" + str + "```";
exports.codeFormat = codeFormat;
/**
 * Make text look like a series of tags [tag1] [tag2] [tag3]
 * @param tags List of tags to be formatted
 * @returns Content in a tag list format
 */
const tagFormat = (tags) => `\`${tags.join("` `")}\``;
exports.tagFormat = tagFormat;
/**
 * List out the names of members as part of a coherent sentence
 * @param members A list of guild members
 * @returns List of members to be used in a sentence
 */
const authorListFormat = (members) => {
    var combinedList = "";
    members.forEach((member, index) => {
        const { username, discriminator } = member.user;
        if (index === 0) {
            combinedList += `${username}#${discriminator}`;
            return;
        }
        combinedList += index == members.length - 1 ? " and " : ", ";
        combinedList += `${username}#${discriminator}`;
    });
    return combinedList;
};
exports.authorListFormat = authorListFormat;
/**
 * Calculates when and when not to add an "s"
 * @param amount The number of units
 * @param unit The name of the unit
 * @returns Unit and amount in their plural or non plural format
 */
const pluralFormat = (amount, unit) => `${amount > 0 ? amount : ""} ${amount > 0 ? unit : ""}${amount > 1 ? "s" : ""}`;
exports.pluralFormat = pluralFormat;
/**
 * Turns duration of milliseconds into a sentence stating
 * how much time is left
 * @param timeInMs Time in milliseconds
 * @returns The duration of time left as a sentence
 */
function durationFormat(timeInMs) {
    var h = Math.floor(timeInMs / 1000 / 60 / 60);
    var m = Math.floor(timeInMs / 1000 / 60 - h * 60);
    var s = Math.floor(timeInMs / 1000 - m * 60 - h * 60 * 60);
    var hours = (0, exports.pluralFormat)(h, "hour");
    var minutes = (0, exports.pluralFormat)(m, "minute");
    var seconds = (0, exports.pluralFormat)(s, "second");
    return [hours, minutes, seconds].join(" ");
}
exports.durationFormat = durationFormat;
