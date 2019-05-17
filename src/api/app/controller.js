
const {validParam, sendErrorResponse, sendSuccessResponse, trimCollection} = require('../../helpers/utility');
const mongoose = require('mongoose');
const Users = mongoose.model('User');



exports.quickmatch = (req, res)  => {
    Users.aggregate([ 
        {$sample: {size: 1} },
    ], (err, match) => {
        console.log(err);
        if (err) 
        {
            return sendErrorResponse(res, {}, 'Something went wrong, please try again');
        }
        return sendSuccessResponse(res, {match}, 'Match found');   
    });   
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
