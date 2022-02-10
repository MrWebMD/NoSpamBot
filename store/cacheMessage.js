const Discord = require("discord.js");


/**
 * A wrapper for a Discord Message object that allows
 * for detection modules to add tags and get quick access
 * to useful properties.
 */
class CacheMessage {
  /**
   *
   * @param {Discord.Message} discordMessage Discord message object
   */
  constructor(discordMessage) {
    /**
     * @property {Discord.Message} Discord message object
     */
    this.discordMessage = discordMessage;
    /**
     * @property {Array<String>} tags List of unique names to classify this message
     */
    this.tags = [];
  }
  /**
   * Give this message a list of tags to describe its behavior and its features
   * @property {Function}
   * @param {String} tagName Unique name to classify this message
   */
  tag(tagName) {
    this.tags.push(tagName);
  }
}

module.exports = { CacheMessage };
