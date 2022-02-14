import Discord from "discord.js";

/**
 * Create a code block automatically. Wrap strings with backticks.
 * @param str Content to wrap into a code block
 * @returns Content wrapped in backticks
 */
export const codeFormat = (str: string): string => "```" + str + "```";

/**
 * Make text look like a series of tags [tag1] [tag2] [tag3]
 * @param tags List of tags to be formatted
 * @returns Content in a tag list format
 */
export const tagFormat = (tags: Array<string>): string =>
  `\`${tags.join("` `")}\``;

/**
 * List out the names of members as part of a coherent sentence
 * @param members A list of guild members
 * @returns List of members to be used in a sentence
 */
export const authorListFormat = (members: Array<Discord.GuildMember>): string => {
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

/**
 * Calculates when and when not to add an "s"
 * @param amount The number of units
 * @param unit The name of the unit
 * @returns Unit and amount in their plural or non plural format
 */
export const pluralFormat = (amount: number, unit: string): string =>
  `${amount > 0 ? amount : ""} ${amount > 0 ? unit : ""}${
    amount > 1 ? "s" : ""
  }`;

/**
 * Turns duration of milliseconds into a sentence stating
 * how much time is left
 * @param timeInMs Time in milliseconds
 * @returns The duration of time left as a sentence
 */
export function durationFormat(timeInMs: number): string {
  var h = Math.floor(timeInMs / 1000 / 60 / 60);
  var m = Math.floor(timeInMs / 1000 / 60 - h * 60);
  var s = Math.floor(timeInMs / 1000 - m * 60 - h * 60 * 60);

  var hours = pluralFormat(h, "hour");
  var minutes = pluralFormat(m, "minute");
  var seconds = pluralFormat(s, "second");

  return [hours, minutes, seconds].join(" ");
}
