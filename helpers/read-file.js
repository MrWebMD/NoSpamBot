const fs = require("fs");

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