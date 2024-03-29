const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    toUserId: {
      type: mongoose.Types.ObjectId,
    },
    fromUserId: {
      type: mongoose.Types.ObjectId,
    },
    message: {
      type: String,
    },
  },
  { strict: true }
);

module.exports = mongoose.model("notifications", schema, "notifications");
