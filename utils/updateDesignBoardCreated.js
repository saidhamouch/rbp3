const axios = require("axios");

const updateDesignBoardCreated = async (boardID, designID) => {
  try {
    const item = {
      board_created: true,
      board_id: boardID,
    };
    await axios.patch(`http://localhost:5000/api/v1/designs/${designID}`, item);
  } catch (error) {
    console.log(error);
  }
};

module.exports = updateDesignBoardCreated;
