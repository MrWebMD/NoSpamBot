import { createStore } from "redux";

import messageCacheReducer from './reducers/messageCacheReducer.js';

const store = createStore(messageCacheReducer);

export default store;
