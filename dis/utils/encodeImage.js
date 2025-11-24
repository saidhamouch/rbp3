const axios = require("axios");

async function encodeImage(url) {
  try {
    let image = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(image.data).toString("base64");
  } catch (error) {
    console.log(error);
  }
}

module.exports = encodeImage;
