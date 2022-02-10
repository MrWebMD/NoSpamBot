const { GuildMember } = require("discord.js");

/**
 * Create a code block automatically. Wrap strings with backticks.
 * @param {String} str Content to wrap into a code block
 * @returns {String} Content wrapped in backticks
 */
const codeFormat = (str) => "```" + str + "```";

/**
 * Make text look like a series of tags [tag1] [tag2] [tag3]
 * @param {Array<String>} tags 
 * @returns {String} Content in a tag list format
 */
const tagFormat = (tags) => `\`${tags.join("` `")}\``;

/**
 * List out the names of members as part of a coherent sentence
 * @param {Array<GuildMember>} members A list of guild members
 * @returns {String} List of members to be used in a sentence
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

// 

/**
 * Calculates when and when not to add an "s"
 * @param {Number} amount The number of units
 * @param {String} unit The name of the unit
 * @returns {String} Unit and amount in their plural or non plural format
 */
const pluralFormat = (amount, unit) =>
  `${amount > 0 ? amount : ""} ${amount > 0 ? unit : ""}${
    amount > 1 ? "s" : ""
  }`;

/**
 * Turns duration of milliseconds into a sentence stating
 * how much time is left
 * @param {Number} timeInMs Time in milliseconds 
 * @returns {String} The duration of time left as a sentence
 */
function durationFormat(timeInMs) {
  var h = Math.floor(timeInMs / 1000 / 60 / 60);
  var m = Math.floor(timeInMs / 1000 / 60 - h * 60);
  var s = Math.floor(timeInMs / 1000 - m * 60 - h * 60 * 60);

  var hours = pluralFormat(h, "hour");
  var minutes = pluralFormat(m, "minute");
  var seconds = pluralFormat(s, "second");

  return [hours, minutes, seconds].join(" ");
}

module.exports = {
  codeFormat,
  tagFormat,
  durationFormat,
  authorListFormat,
};
