import fs from "fs";

/**
 * Load the contents of a file into a string
 * @param filePath Path of the file to load
 * @returns String containing the file content
 */
export default (filePath: string): Promise<string> => {

  return new Promise((resolve, reject) => {
    
    fs.readFile(filePath, "utf8", (err, content) => {
      if (err) {
        reject(err);
      }

      resolve(content);
    });

  });

};
