const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "must provide title"],
  },
  shared: {
    type: Boolean,
    default: false,
  },
  productsLink: {
    type: String,
  },
  id: {
    type: String,
  },
  products: {
    type: Array,
  },
  board_created: {
    type: Boolean,
    default: false,
  },
  board_id: {
    type: String,
    default: "",
  },
  index: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Design", DesignSchema);
//module.exports = mongoose.model("Backup_Design", DesignSchema);
