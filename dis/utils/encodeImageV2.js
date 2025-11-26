const fs = require("fs");

async function encodeLocalImage(path) {
  try {
    let buffer = fs.readFileSync(path);
    return buffer.toString("base64");
  } catch (err) {
    console.log(err);
  }
}

module.exports = encodeLocalImage;
