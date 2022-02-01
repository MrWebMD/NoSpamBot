const removeOldMessages = (messages, maxAge) => {
  return messages.filter((message) => getMessageAge(message) <= maxAge);
};

const getMessageDuplicates = (message, messages) => {
  return messages
    .filter(
      (similarMessage) =>
        similarMessage.content.toLowerCase() === message.content.toLowerCase()
    )
    .map((message) => message.id);
};

const getMessageDuplicatesByAuthor = (message, messages) => {
  return getMessageDuplicates(
    message,
    messages.filter((m) => m.author.id === message.author.id)
  );
};

const messagesToTable = (messages) => {
  /**
   * Logs out an array of processed
   * messages as an array to the console
   */

  const msToSeconds = (ms) => Math.floor(ms / 1000);

  console.log("");
  console.table(
    messages.map((message) => {
      return {
        TAGS: message.tags.join(","),
        CONTENT: message.content.substr(0, 15) + "...",
        ID: message.id,
        AGE: msToSeconds(getMessageAge(message)) + "s",
      };
    })
  );
  console.log("");
};

const getMessageLinks = (message) => {
  return message.content.match(/((https?:\/\/)?[^\s.]+\.[\w][^\s]+)/g) || [];
};

const defangMessageLinks = (message) => {
  const messageLinks = getMessageLinks(message);

  var defangedText = message.content;

  for (link of messageLinks) {
    var thirdLinkLength = Math.floor(link.length / 3);
    var thirdOfLink = link.substr(thirdLinkLength, thirdLinkLength);
    var newLink = link.replaceAll(thirdOfLink, ".".repeat(thirdLinkLength));

    defangedText = defangedText.replaceAll(link, newLink);
  }

  return defangedText;
};

const tagMessage = (message, tag) => {
  if (!message.tags.includes(tag)) {
    message.tags.push(tag);
  }
};
const tagMessages = (messages, tag) => {
  messages.map((message) => {
    tagMessage(message, tag);
  });
};
const messageHasEmbeds = (message) => {
  return message.embeds.length > 0;
};

const getMessageAge = (message) => {
  return Date.now() - message.createdTimestamp;
};

module.exports = {
  removeOldMessages,
  getMessageDuplicates,
  getMessageAge,
  messageHasEmbeds,
  getMessageDuplicatesByAuthor,
  tagMessages,
  tagMessage,
  getMessageLinks,
  defangMessageLinks,
  messagesToTable
};
