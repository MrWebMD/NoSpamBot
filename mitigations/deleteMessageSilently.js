module.exports = (message) => {
  message
    .delete()
    .then((message) =>
      console.log(`Deleted message from ${message.author.username}`)
    )
    .catch(console.log);
};
