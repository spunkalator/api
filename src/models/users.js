
'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    let onlineStatusSchema = new Schema({
        lastUpdated: {
            type: Date,
            default: Date.now
        },
        status: Boolean,
    });
    

let UsersSchema = new Schema({
    

    nickname: { 
        type: String,
       
    },
    memberId: { 
        type: String,  
    },

    city: String,

    email: { 
        type: String,
       
    },
    token: {
        type: String,

    },
    forgotPassword: String,
    gender: String,
    
    dob: String,
   
    lastLocation: {
        type: ['Point'],
        coordinates: [ ],
    },
    birthday: Date,
    description: String,
    password: {
        type: String,   
    },
    onlineStatus: onlineStatusSchema,
    delivered: {
        type: Boolean,
        required: true,
        default: false
    },
    subscriptionStatus: { 
        type: String,
    },

    defaultImage : String,
    images: [],
    likes: Number,
    created: {type: Date, require:true, default: Date.now}

});
UsersSchema.index( { "lastLocation" : "2dsphere" } )
module.exports = mongoose.model('User', UsersSchema);
