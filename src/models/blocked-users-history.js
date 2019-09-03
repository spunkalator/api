
'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  

let BlockedUsersHistorySchema = new Schema({
    
    blocker: String,      
    blocked: String,

    reason: String,
    status: String,

    created: {type: Date, require:true, default: Date.now}

});
module.exports = mongoose.model('BlockedUsersHistory', BlockedUsersHistorySchema);
