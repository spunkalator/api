
'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  

let LikedUsersHistorySchema = new Schema({
    
    liker: String,      
    liked: String,
    status: String,
    created: {type: Date, require:true, default: Date.now}

});
module.exports = mongoose.model('LikedUsersHistory', LikedUsersHistorySchema);
