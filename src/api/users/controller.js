
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
      
                
                let nUser             = new Users();
                nUser.nickname        = body.nickname;
                nUser.description     = body.description;
               
                Users.updateOne({nickname: userDetails.nickname}, {
                    $set: {
                        nickname: body.nickname,
                        description: body.description, 
                    },
                   
                }, (err, updated) => {
                    
                    console.log(updated, "updated");

                    if (err) {
                        console.log(err);
                        return sendErrorResponse(res, {}, 'Something went wrong, please try again');
                    }

                    if (updated && updated.nModified) {
                        return sendSuccessResponse(res, {user: nUser}, 'Profile has been updated');
                    } else {
                        return sendErrorResponse(res, {}, 'Nothing changed, you\'re all set!');
                    }
                });

       
       

    }else{
        return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
    } 

}

exports.profileDetails = (req, res) => {
    if(req.params.nickname){
        Users.findOne( {nickname: req.params.nickname}, (err, result) => 
            {
                console.log(req.params.nickname);
                if(result){
                    
                    return sendSuccessResponse(res, {user: result}, 'Profile details');

                }else{
                    return sendErrorResponse(res, {}, 'User not found');
                }
            });
    }else
    {
      return sendErrorResponse(res, {}, 'Nickname is required');
    }

}

exports.nearbyUsers = (req, res) => {
    let required = [
        {name: 'location', type: 'string'},
       
    ];

    req.body = trimCollection(req.body);
    const body = req.body;
    
    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {

     
    }else
    {
      return sendErrorResponse(res, {}, 'Current location is required');
    }

}

exports.updateLocation = (req, res) => {
    let required = [
        {name: 'location', type: 'string'},
       
    ];

    req.body = trimCollection(req.body);
    const body = req.body;
    
    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {

        userDetails = req.payload;

        Users.updateOne({nickname: userDetails.nickname}, {
            $set: {
                lastlocation: body.location,
              
            },
           
        }, (err, updated) => {
            
            console.log(updated, "updated");

            if (err) {
                console.log(err);
                return sendErrorResponse(res, {}, 'Something went wrong, please try again');
            }

            if (updated && updated.nModified) {
                return sendSuccessResponse(res, {user: nUser}, 'Location has been updated');
            } else {
                return sendErrorResponse(res, {}, 'Nothing changed, you\'re all set!');
            }
        });

     
    }else
    {
      return sendErrorResponse(res, {}, 'Current location is required');
    }

}
