const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    type: String,
    coordinates: Array,
  },
  { _id: false }
);
const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      min: 1,
      required: true,
    },
    lastName: {
      type: String,
      min: 1,
      required: true,
    },
    username: {
      type: String,
      min: 1,
      required: true,
    },
    password: {
      type: String,
      min: 1,
      required: true,
    },
    displayPicture: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      min: 1,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    interests: {
      type: String,
      required: true,
    },
    description: {
      type: Array,
      required: true,
    },
    preferences: {
      genders: {
        type: Array,
      },
      age: {
        min: {
          type: Number,
        },
        max: {
          type: Number,
        },
      },
    },
    acceptedUsers: {
      type: Array,
      default: [],
    },
    rejectedUsers: {
      type: Array,
      default: [],
    },
    location: locationSchema,
  },
  { strict: true }
);

module.exports = mongoose.model("users", schema, "users");
