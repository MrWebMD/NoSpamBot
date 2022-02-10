const fs = require("fs");

/**
 * 
 * @param {String} filePath path of file to load
 * @returns String containg the file content
 */
module.exports = (filePath) => {

  return new Promise((resolve, reject) => {
  
    fs.readFile(filePath, "utf8", (err, content) => {
  
      if (err) {
        resolve([null, err]);
      }
  
      resolve([content, null]);
  
    });
  
  });

};