
const {validParam, sendErrorResponse, sendSuccessResponse, trimCollection} = require('../../helpers/utility');
const mongoose = require('mongoose');
const Users = mongoose.model('User');


exports.editProfile = (req, res) => {
    let required = [
        {name: 'nickname', type: 'string'},
        {name: 'description', type: 'string'},
        
    ];

    req.body = trimCollection(req.body);
    const body = req.body;
    
    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {
     
      userDetails = req.payload;
      console.log(userDetails.nickname, "nickname");

      Users.findOne({nickname: userDetails.nickname}, function (err, result) {

            if (err) {
                return sendErrorResponse(res, {err}, 'Something went wrong');
            }
           
            if (result) {
                
                let nUser       = new Users();
                nUser.nickname        = body.nickname;
                nUser.description     = body.email;
               
                nUser.save((err) => {
                    console.log(err);
                    if (err) {
                        return sendErrorResponse(res, {err}, 'Something went wrong');
                    }
                    return sendSuccessResponse(res, {user: nUser}, 'Your profile has been updated');
                });

         }else{
             console.log(err);
             return sendErrorResponse(res, {}, 'We suddenly couldn\'t find your profile, Please contact support ');
         }               
        }); 
       

    }else{
        return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
    } 

}


