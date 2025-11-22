const axios = require("axios");
require('dotenv').config();

const token = process.env.PINTEREST_USER_TOKEN
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

const deletePins = async () => {
    for (let index = 0; index < data.length; index++) {
      const pin_id = data[index].id;
      try {
        const deletedBoard = await axios.delete(
          `https://api.pinterest.com/v5/pins/${pin_id}`,
          config
        )
        console.log(index + " deleted");
      } catch (error) {
        console.error(error)
      }
    }
  }
