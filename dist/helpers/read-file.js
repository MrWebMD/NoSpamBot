"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
/**
 * Load the contents of a file into a string
 * @param filePath Path of the file to load
 * @returns String containing the file content
 */
exports.default = (filePath) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(filePath, "utf8", (err, content) => {
            if (err) {
                reject(err);
            }
            resolve(content);
        });
    });
};
