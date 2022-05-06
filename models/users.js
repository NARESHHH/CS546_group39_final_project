const { date, array, object } = require("joi");
const mongoose = require("mongoose");

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
    gender: {
      type: String,
      min: 1,
      required: true,
    },
    phone: {
      type: String,
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
      gender: {
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
  },
  { strict: true }
);

module.exports = mongoose.model("users", schema, "users");
