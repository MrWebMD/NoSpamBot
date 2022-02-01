const {
  messageHasEmbeds,
  tagMessage,
} = require("../helpers/message-helpers.js");

/**
 * Module Overview
 *
 * Name: Nitro Scam
 *
 * TAG: "NITROSCAM"
 *
 * Description: This module tags "NITROSCAM" to any message that appears
 * to fit the description of a nitro scam link. Things such as message contents and embed
 * descriptions are analyzed for keywords that look like a nitro link.
 *
 * Remember that we can still exlude entire roles (such as staff and members) from
 * analyzation by the anti-spam bot. Maybe we only want to run this for people
 * with no roles. You can do that by exluding roles in the settings.
 *
 * 5 question test (3/5 to pass as a scam message):
 *
 * Must have a link to be considered
 * 1. 20pts Has "Discord" or "Nitro" in the embed title
 * 2. 20pts Has the "DUPLICATE" tag (could indicate a link spray across channels)
 * 3. 20pts Mentions everyone or has "everyone" in its content + 20 extra credit
 * 4. 20pts has discord nitro keywords in message content or embed
 * 5. 20pts The message contents do not contain the official discord links
 *
 *
 */
//has a link, but not any of the offical ones, but also mentions everyone. That sounds like an announcement
/**
 *
 * @param {Array} messages Array of Discord Message Objects
 * @param {Object} settings Settings object as defined in settings.hjson
 * @returns {Array} An array of Discord Message objects. Except,
 * each object has a new property called "tags" (array of strings representing the types of spam)
 *
 * Example of message.tags:  ["DUPLICATE", "NITROSCAM"]
 */

module.exports = (messages, settings) => {
  const { MODULE_TAG, keywordMatchThreshold, domains } =
    settings.modules.nitroScam;

  const scamKeywords = settings.modules.nitroScam.scamKeywords.toLowerCase();

  

  return messages.map((message) => {

    console.log(message)

    console.clear();

    var testScore = 0;
    var maximumTestScore = 100;
    var amountOfQuestions = 5;
    var pointsPerTest = maximumTestScore / amountOfQuestions;
    var passingScamGrade = 4 * pointsPerTest;

    const messageText = message.content.toLowerCase();

    /**
     * Message must have a link to be considered for this
     * module.
     */

    console.log("Text: ", messageText);

    if (!messageText.includes("https://") && !messageText.includes("http://")) {
      console.log("Message does not have link");

      return message;
    }
    console.log("Message has link");

    /* 1. 20pts Has discord in embed title */
    if(messageHasEmbeds(message)){
      const title = message.embeds[0].title.toLowerCase()
      if(title.includes("discord") || title.includes("nitro")){
        testScore += pointsPerTest;
        console.log("Embed contains discord nitro title + 20");
      } else {
        console.log("Embed does not contain discord nitro title");
      }
    }
    

    /* 2. 20pts Has the "DUPLICATE" tag (could indicate a link spray across channels) */

    if (message.tags.includes(settings.modules.duplicates.MODULE_TAG)) {
      testScore += pointsPerTest;
      console.log("Message is duplicate + 20");
    } else {
      console.log("Message is not duplicate");
    }

    /* 3. 20pts Mentions everyone or has "everyone" in its content */

    if (messageText.includes("everyone") || messageText.includes("here")) {
      console.log("Message mentions everyone + 20 + 20 extra credit");
      testScore += pointsPerTest + 20;
    } else {
      console.log("Mention does not mention everyone");
    }

    /* 4. 20pts has discord nitro keywords in message content or embed */

    var embedText = "";
    if (messageHasEmbeds(message)) {
      for (embed of message.embeds) {
        if (embed.title) {
          embedText += embed.title;
        }
        if (embed.description) {
          embedText += embed.description;
        }
      }
    }

    const messageAndEmbedTextKeywords = (messageText + " " + embedText)
      .toLowerCase()
      .split(" ");
    console.log("Searching keywords: " + messageAndEmbedTextKeywords);

    var keywordsDetected = 0;

    for (messageKeyword of messageAndEmbedTextKeywords) {
      // remove white space
      const trimmedMessageKeyword = messageKeyword.trim();

      if (scamKeywords.includes(trimmedMessageKeyword)) {
        keywordsDetected++;
      }
    }

    const keywordMatchPercentage =
      (keywordsDetected / messageAndEmbedTextKeywords.length) * 100;
    if (keywordMatchPercentage >= keywordMatchThreshold) {
      console.log("Message has enough keywords + 20");

      testScore += pointsPerTest;
    } else {
      console.log("Message does not have enough keywords");
    }

    console.log(
      `${keywordMatchPercentage}% keyword match (${keywordMatchThreshold}% needed)`
    );

    /* 5. 20pts The message contents do not contain the official discord links */

    var legitimateDomainsFound = 0;

    for (var domain of domains) {
      if (message.content.includes(domain)) {
        legitimateDomainsFound += 1;
      }
    }

    if (legitimateDomainsFound === 0) {
      testScore += pointsPerTest;
      console.log("No domains found + 20");
    } else {
      console.log("This message has discord domains");
    }

    console.log(`Test Score: ${testScore} / ${passingScamGrade}`);

    if (testScore >= passingScamGrade) {
      tagMessage(message, MODULE_TAG);
      console.log("This is a nitro scam");
    } else {
      console.log("this is not a nitro scam");
    }

    return message;
  });
};
