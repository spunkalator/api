
'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
   
    images: [{
        path: String,
    }],
    created: {type: Date, require:true, default: Date.now}

});
UsersSchema.index( { "lastLocation" : "2dsphere" } )
module.exports = mongoose.model('User', UsersSchema);
