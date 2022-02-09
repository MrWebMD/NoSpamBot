const codeFormat = (str) => "```" + str + "```";

const tagFormat = (tags) => `\`${tags.join("` `")}\``;

const authorListFormat = (members) => {
  var combinedList = "";

  members.forEach((member, index) => {

    const {username, discriminator} = member.user;

    if (index === 0) {
      combinedList += `${username}#${discriminator}`;
      return;
    }

    combinedList += index == members.length - 1 ? " and " : ", ";
    combinedList += `${username}#${discriminator}`;

  });

  return combinedList;
};

const pluralFormat = (amount, unit) =>
  `${amount > 0 ? amount : ""} ${amount > 0 ? unit : ""}${
    amount > 1 ? "s" : ""
  }`;

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
  authorListFormat
};
