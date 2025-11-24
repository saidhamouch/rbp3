const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const token = process.env.PINTEREST_USER_TOKEN;
const config = {
  headers: { Authorization: `Bearer ${token}` },
};

const createBoard = async (title) => {
  const editedTitle = editTitle(title);
  try {
    const payload = {
      name: `${editedTitle} - Metal Posters`,
      description: `${title} Metal Posters - Displate`,
      privacy: "PUBLIC",
    };
    const board = await axios.post(
      "https://api.pinterest.com/v5/boards/",
      payload,
      config
    );
    return board;
  } catch (error) {
    console.log(error);
  }
};

function editTitle(title) {
  if (title.length > 44) {
    while (title.length > 44) {
      title = title.slice(0, title.lastIndexOf(" "));
    }
  }
  return title;
}

module.exports = createBoard;
