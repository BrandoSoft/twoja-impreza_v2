const mongoose = require ('mongoose');
const { Schema } = require("mongoose");

const PartyListSchema = new mongoose.Schema({
    user: {
      type: Schema.Types.ObjectId,
      refs: 'users'
    },
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,

    },
    date:{
        type: Date,
        required: true,
    },
    time:{
        type: String,

    },
    place:{
        type: String,

    },
    organizer:{
        type: String,

    },
    followers: {
        type: [String],
    },
    age: {
        type: [String],
    },
    category: {
        type: [String],
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String
            },
            date:{
                type: Date,
                default: Date.now()
            }
        }
    ],
    createDate:{
        type: Date,
        default: Date.now()
    }
});

module.exports = Party = mongoose.model('party', PartyListSchema);