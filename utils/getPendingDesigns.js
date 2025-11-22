const axios = require("axios");

const getPendingDesigns = async () => {
  let pendingDesigns = [];
  try {
    pendingDesigns = await axios
      .get(`http://localhost:5000/api/v1/designs`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
  return pendingDesigns;
};

module.exports = getPendingDesigns;
