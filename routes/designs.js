const express = require("express");
const router = express.Router();

const {
  addDesign,
  addBuckupDesign,
  updateDesignBoardCreated,
  updatePinCreated,
  getPendingDesigns,
  getSingleDesign,
} = require("../controllers/designs");

router.route("/").get(getPendingDesigns);
router.route("/").post(addDesign);
router.route("/backup/").post(addBuckupDesign);
router.route("/:id/").get(getSingleDesign).patch(updateDesignBoardCreated);
router.route("/:id/:productID").patch(updatePinCreated);

module.exports = router;
