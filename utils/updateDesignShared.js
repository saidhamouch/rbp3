const axios = require("axios");

const updateDesignShared = async (designID) => {
  try {
    const item = {
      shared: true,
    };
    await axios.patch(`http://localhost:5000/api/v1/designs/${designID}`, item);
  } catch (error) {
    console.log(error);
  }
};

module.exports = updateDesignShared;
