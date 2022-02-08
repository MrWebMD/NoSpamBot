const codeFormat = (str) => "```" + str + "```";

const tagFormat = (tags) => `\`${tags.join("` `")}\``;

module.exports = {
  codeFormat,
  tagFormat
};
