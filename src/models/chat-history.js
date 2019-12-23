
'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  

let ChatHistorySchema = new Schema({
    
    from: String,      
    to: String,
    lastMessage: String,

    created: {type: Date, require:true, default: Date.now}

});
module.exports = mongoose.model('ChatHistory', ChatHistorySchema);
