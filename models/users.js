const { date, array, object } = require('joi');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        min: 1,
        required:true,
    },
    lastName:{
        type: String,
        min:1,
        required:true
    },
    email:{
        type:String,
        min:1,
        required:true
    },
    gender:{
        type:String,
        min:1,
        required:true
    },
    phone:{
        type: String,
        required:true
    },
    dateOfBirth:{
        type:Date,
        required:true
    },
    hobbies:{
        type:Array,
        required:true
    },
    description:{
        type:Array,
        required:true
    },
    interestsText:{
        type:String
    },
    preferences:{
            gender:{
                type:Array,

            },
            age:{
                min:{
                    type:Number,
                },
                max:{
                    type: Number
                }
            }
        },

    
}, {strict: false})

module.exports = mongoose.model('users', schema, 'users');

  
