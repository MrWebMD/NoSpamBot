const { createStore } = require("redux");

const messageCacheReducer = require('./reducers/messageCacheReducer.js');

const store = createStore(messageCacheReducer);

module.exports = store;
