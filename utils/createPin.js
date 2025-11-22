const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const token = process.env.PINTEREST_USER_TOKEN;
const config = {
  headers: { Authorization: `Bearer ${token}` },
};

const createPin = async (payload) => {
  try {
    const pin = await axios.post(
      "https://api.pinterest.com/v5/pins",
      payload,
      config
    );
    return pin;
  } catch (error) {
    console.log(error);
  }
};

module.exports = createPin;
