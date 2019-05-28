
const {validParam, sendErrorResponse, sendSuccessResponse, trimCollection} = require('../../helpers/utility');
const mongoose = require('mongoose');
const Users = mongoose.model('User');



exports.quickmatch = (req, res)  => {
   
    if (req.params.n && !isNaN(req.params.n)) {

        let number  =  parseInt(req.params.n);
       
        Users.aggregate([ 
            {$sample: {size: number} },
        ], (err, match) => {
            console.log(err);
            if (err) 
            {
                return sendErrorResponse(res, {}, 'Something went wrong, please try again');
            }
            return sendSuccessResponse(res, {match}, 'Match found');   
        });  
    
    }else{
        return sendErrorResponse(res, {}, 'Number of users is required and it must be a number');
    }

}

exports.nearbyUsers = (req, res) => {
    let required = [
        {name: 'location', type: 'object'},
    ];
    req.body = trimCollection(req.body);
    const body = req.body;
    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {

        Users.aggregate([ 
            {$sample: {size: 10} },
        ], (err, popular) => {
            console.log(err);
            if (err) 
            {
                return sendErrorResponse(res, {}, 'Something went wrong, please try again');
            }
            return sendSuccessResponse(res, {popular}, 'Nearby users');   
        }); 

        // Users.find( 
        //     {
        //         'lastLocation' :
        //         {
        //           $near: {
        //             $geometry: {
        //                  type: "Point" ,
        //                  coordinates: [ body.lastLocation]
        //             },
        //             $maxDistance: 100
        //         }
        //     }
        //     },function(err,result){
        //         return sendSuccessResponse(res, { users: result}, 'Users near you');
        //     })
     
    }else
    {
        return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
    }
}

exports.popular = (req, res)  => {
    
    Users.aggregate([ 
        {$sample: {size: 10} },
    ], (err, popular) => {
        console.log(err);
        if (err) 
        {
            return sendErrorResponse(res, {}, 'Something went wrong, please try again');
        }
        return sendSuccessResponse(res, {popular}, 'Popular users');   
    });  
    
    
}


exports.likeUser = (req, res) => {
    
    console.log(req.params.username);
    if (req.params.username) {

        Users.updateOne(
            { nickname: req.params.username }, {
            $inc: {
                likes:1,
            },
        }, (err, updated) => {
            console.log(updated, "updated");
            if (err) {
                console.log(err);
                return sendErrorResponse(res, {}, 'Something went wrong, please try again');
            }
            if (updated && updated.nModified) {
                return sendSuccessResponse(res, { }, 'Liked!');
            }
        });

    }else{
        return sendErrorResponse(res, {}, 'Username of the person you\'re liking is required');
    }
}
