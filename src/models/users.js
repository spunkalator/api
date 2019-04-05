
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
        required: true
    },
    gender: { 
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    
    
    created: {type: Date, require:true, default: Date.now}

});

module.exports = mongoose.model('User', UsersSchema);
