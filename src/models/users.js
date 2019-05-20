
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
        required: true
    },
    email: { 
        type: String,
       
    },
    gender: { 
        type: String,
        
    },
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
    defaultImage : String,
    images: [{
        path: String,
    }],
    likes: Number,
    created: {type: Date, require:true, default: Date.now}

});
UsersSchema.index( { "lastLocation" : "2dsphere" } )
module.exports = mongoose.model('User', UsersSchema);
