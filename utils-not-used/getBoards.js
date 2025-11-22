const axios = require("axios");
require("dotenv").config();
const fs = require("fs");

const token = "";
const config = {
  headers: { Authorization: `Bearer ${token}` },
};

const getBoards = async () => {
  try {
    const boards = await axios.get(
      "https://api.pinterest.com/v5/boards?page_size=250",
      config
    );

    console.log(boards.data.items);
    fs.writeFile(
      "boards2.json",
      JSON.stringify(boards.data.items),
      function (err) {
        console.log(err);
      }
    );

    console.log(boards.data.items);
  } catch (error) {
    console.error(error);
  }
};
getBoards();
