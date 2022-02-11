"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const messageCacheReducer_js_1 = __importDefault(require("./reducers/messageCacheReducer.js"));
const store = (0, redux_1.createStore)(messageCacheReducer_js_1.default);
exports.default = store;
