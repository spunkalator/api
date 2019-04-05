
const request = require('request');
const util = require('../helpers/utility');
const jwt  = require('jsonwebtoken');



exports.authenticate = (req, res, next) => {
    console.log(req.payload);
    if(req.payload){
        return next();
    }

    if(req.header('Authorization')){
        const authToken = req.header('Authorization').split(' ')[1];

        jwt.verify(authToken, process.env.JWT_SECRET, function(err, decoded) {
            if(err){
                return util.sendErrorResponse(res, [], "Not Authenticated. Bad/Expired Token", 401);
            }else{
              return next();
            }
            
          });
       
    }else {
        return util.sendErrorResponse(res, [], "Not authenticated", 401);
    }
};


