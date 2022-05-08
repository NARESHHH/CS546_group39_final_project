
const mongoose = require("mongoose");

const inboxschema = new mongoose.Schema(
    {
        fromUser: {
            type:String,
            min:1

        },
        status: {
            type:String,
            min:1
        },
        type: {
            type : String,
            min:1,
        },
        Message:{
            type:String,
            min:1,
        }

    },
    
  );


  module.exports = mongoose.model("indox", schema, "indox");