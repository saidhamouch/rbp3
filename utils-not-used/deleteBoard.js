const axios = require("axios");
require('dotenv').config();

const token = process.env.PINTEREST_USER_TOKEN
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

const deleteBoard = async (board_id) => {
    try {
      const deletedBoard = await axios.delete(
        `https://api.pinterest.com/v5/boards/${board_id}`,
        config
      )
      console.log(deletedBoard);
    } catch (error) {
      console.error(error)
    }
  }
