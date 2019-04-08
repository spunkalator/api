
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
    location: String,
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

module.exports = mongoose.model('User', UsersSchema);
