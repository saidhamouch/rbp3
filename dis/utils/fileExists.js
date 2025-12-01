const fs = require("fs");
const path = require("path");

/**
 * Checks if a file named NUMBER.* exists in a given folder
 * @param {number|string} number - the number (filename without extension)
 * @param {string} folderPath - path to folder
 * @param {string} extension - file extension (default: .json)
 * @returns {boolean}
 */
function fileExists(number, folderPath, extension) {
  // Convert number to string filename
  const fileName = `${number}${extension}`;

  // Build absolute path
  const fullPath = path.join(folderPath, fileName);

  // Check if exists
  return fs.existsSync(fullPath);
}

module.exports = fileExists;
