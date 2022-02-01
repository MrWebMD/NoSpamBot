module.exports.addMessage = (message, settings) => {
  return {
    type: "ADD_MESSAGE",
    payload: { message, settings },
  };
};
module.exports.flushCache = () => {
  return {
    type: "FLUSH_CACHE",
    payload: {},
  };
};