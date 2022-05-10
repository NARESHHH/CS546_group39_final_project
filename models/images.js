const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
    },
    img: {
      type: String,
    },
  },
  { strict: true }
);

module.exports = mongoose.model("images", schema, "images");
