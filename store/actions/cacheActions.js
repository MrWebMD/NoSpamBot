module.exports.addMessage = (message, settings, detectionModules) => {
  return {
    type: "ADD_MESSAGE",
    payload: { message, settings, detectionModules },
  };
};
module.exports.flushCache = () => {
  return {
    type: "FLUSH_CACHE",
    payload: {},
  };
};