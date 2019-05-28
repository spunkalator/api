
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

                imagefile = {
                    path: body.image
                };

                Users.updateOne({email: userDetails.email}, {
                    $set: {
                        nickname: body.nickname,
                        description: body.description,
                        defaultImage: body.defaultImage, 
                       
                    },
                    $push: { 
                        images: imagefile
                    }

                   
                }, (err, updated) => {
                    
                    console.log(updated, "updated");

                    if (err) {
                        console.log(err);
                        return sendErrorResponse(res, {}, 'Something went wrong, please try again');
                    }

                    if (updated && updated.nModified) {
                        return sendSuccessResponse(res, {}, 'Profile has been updated');
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



exports.updateLocation = (req, res) => {
    let required = [
        {name: 'location', type: 'object'}, 
    ];

    req.body = trimCollection(req.body);
    const body = req.body;
    
    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {

        userDetails = req.payload;

        Users.updateOne({email: userDetails.email}, {
            $set: {
                lastLocation: body.location,
            },
        }, (err, updated) => {
            console.log(updated, "updated");
            if (err) {
                console.log(err);
                return sendErrorResponse(res, {}, 'Something went wrong, please try again');
            }
            if (updated && updated.nModified) {
                return sendSuccessResponse(res, { }, 'Location has been updated');
            } else {
                return sendErrorResponse(res, {}, 'Nothing changed, you\'re all set!');
            }
        });

     
    }else
    {
        return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
    }

}

exports.updateUserStatus = (req, res) => {
    let required = [
        {name: 'status', type: 'string'}, 
    ];

    req.body = trimCollection(req.body);
    const body = req.body;
    
    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {

        userDetails = req.payload;
        lstatus = body.status.toLowerCase();

        if(lstatus !== "true" && lstatus!== "false")
        {
            return sendErrorResponse(res, {}, 'Status must either be true or false');
        }
        stat = {
            status: lstatus !== 'false',
        };
        Users.updateOne({email: userDetails.email}, {
            $set: {
                onlineStatus: stat,
            },
        }, (err, updated) => {
            console.log(updated, "updated");
            if (err) {
                console.log(err);
                return sendErrorResponse(res, {err}, 'Something went wrong, please try again');
            }
            if (updated && updated.nModified) {
                return sendSuccessResponse(res, { }, 'Status has been updated');
            } else {
                return sendErrorResponse(res, {}, 'Nothing changed, you\'re all set!');
            }
        });
    }else
    {
        return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
    }

}


function appfilter(params) {
    let {age, gender, active} = {...params};

    let match = {};
       
    if (gender) {
        match['gender'] = gender;
    }
    if (age) {
        match['age'] = age;
    }
    if (active) {

        const aStatus = new Date(dateCreated);
        match['created'] = {'$eq': dC};

        match['active'] = active;
    }
    
    return {match};
}
