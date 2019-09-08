
'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  

let reportsSchema = new Schema({
    
    blocker: String,      
    blocked: String,

    status: String,

    created: {type: Date, require:true, default: Date.now}

});
module.exports = mongoose.model('report', reportsSchema);
