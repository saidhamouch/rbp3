const axios = require("axios");

const updatePinShared = async (designID, productID) => {
  try {
    const item = {
      shared: true,
    };
    await axios.patch(
      `http://localhost:5000/api/v1/designs/${designID}/${productID}`,
      item
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = updatePinShared;
