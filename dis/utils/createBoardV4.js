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
      name: `${editedTitle} Posters Displate Metal`,
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

// Displate Metal Posters
// name: `${editedTitle} Metal Posters`,
// name: `${editedTitle} Metal Posters - Displate`,
// name: `${editedTitle} Displate Posters`,
// 3 -  name: `${editedTitle} Posters - Displate`,
// 4-1 -  name: `${editedTitle} Metal Poster`,
// 4-2 -  name: `${editedTitle} Poster Metal Displate`,
// 5 -  name: `${editedTitle} Displate Metal Posters`,
// 6 -  name: `${editedTitle} Posters Displate Metal`,
