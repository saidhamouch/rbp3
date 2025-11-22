const axios = require("axios");
require('dotenv').config();

const token = process.env.PINTEREST_USER_TOKEN
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

const getBoards = async () => {
    try {
      const boards = await axios.get(
        'https://api.pinterest.com/v5/boards',
        config
      )
        
      console.log(boards.data.items);
    //   fs.writeFile("boards.json", JSON.stringify((boards.data.items)), function (err) {
    //     console.log(err);
    //   });
  
      console.log(boards.data.items);
    } catch (error) {
      console.error(error)
    }
  }
