const axios = require("axios");
require('dotenv').config();

const token = process.env.PINTEREST_USER_TOKEN
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

const getPins = async () => {
    try {
      const pins = await axios.get(
        'https://api.pinterest.com/v3/pidgets/users/litemovies/pins/',
        config
      )
  
      fs.writeFile("boards.json", JSON.stringify((pins.data.data.pins)), function (err) {
        console.log(err);
      });
  
      console.log(pins);
    } catch (error) {
      console.error(error)
    }
  }
