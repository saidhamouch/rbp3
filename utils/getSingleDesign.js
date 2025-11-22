const axios = require("axios");

const getSingleDesign = async (id) => {
  let singleDesign = {};
  try {
    singleDesign = await axios
      .get(`http://localhost:5000/api/v1/designs/${id}`)
      .then((res) => {
        console.log(res.data.design.board_created);
        return res.data.design;
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
  return singleDesign;
};
module.exports = getSingleDesign;
