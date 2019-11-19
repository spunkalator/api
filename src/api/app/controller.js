
const {validParam, sendErrorResponse, sendSuccessResponse, trimCollection} = require('../../helpers/utility');
const mongoose = require('mongoose');
const Users = mongoose.model('User');
const ChatHistory = mongoose.model('ChatHistory');

const report = mongoose.model('report');

const BlockedUser = mongoose.model('BlockedUsersHistory');
const likedHistory = mongoose.model('LikedUsersHistory');

const ObjectId = require('mongodb').ObjectId;


  exports.logChatHistory = (req, res) => {
    let required = [
        {name: 'from', type: 'string'},
        {name: 'to', type: 'string'},
    ];
    req.body = trimCollection(req.body);
    const body = req.body;
    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {

        ChatHistory.findOne({ $or: [ {from: body.from, }, {to: body.to}, { from: body.to },{to: body.from} ] },(err, result) => 
        {
            if (err)
            {
                console.log(err);
                return sendErrorResponse(res, {}, 'Something went wrong, please try again');
            }
            if (result){

                return sendSuccessResponse(res, {}, 'History already logged');

            }else{
                
                let nHistory      = new ChatHistory();
                nHistory.from  = body.from;
                nHistory.to     = body.to;
               
                nHistory.save((err) => {
                    console.log(err);
                    if (err) {
                        console.log(err);
                        return sendErrorResponse(res, {}, 'Something went wrong');
                    }
                    return sendSuccessResponse(res, {}, 'History logged');
                });
            }
        });
    }else
    {
        return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
    }
}

  exports.blockUser = (req, res) =>{
    let required = [
        {name: 'blocker', type: 'string'},
        {name: 'blocked', type: 'string'},
        {name: 'status', type: 'string'},
    ];
    
    req.body = trimCollection(req.body);
    const body = req.body;
    
    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {

        if(body.status === "unblocked")
        {

            BlockedUser.deleteOne( {blocked: body.blocked, blocker: body.blocker}, (err, del) => {
                if(err)
                {
                    console.log(err);
                    return sendErrorResponse(res, {}, 'Something went wrong, please try again');
                }

                if(del.deletedCount){
                    return sendSuccessResponse(res, {}, 'User has been unblocked');
                }else{
                    return sendSuccessResponse(res, {}, 'User has already been unblocked');
                }

             });

           
        }else{

            BlockedUser.updateOne(
                {blocker: body.blocker, blocked: body.blocked},
                { $set: { blocker: body.blocker, blocked: body.blocked, status : body.status } },
                { upsert: true },
                (err, updated) => {

                    if(err)
                        {
                            console.log(err);
                            return sendErrorResponse(res, {}, 'Something went wrong, please try again');
                        }
                        return sendSuccessResponse(res, {}, 'User has been ' + body.status);

            });
        }

    }else{
        return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
    }

}

exports.likeUser = (req, res) => {
    
    let required = [
        {name: 'liker', type: 'string'},
        {name: 'liked', type: 'string'},
       
    ];
    
    req.body = trimCollection(req.body);
    const body = req.body;
    
    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {

        likedHistory.updateOne(
            {liker: body.liker, liked: body.liked},
            { $set: { liker: body.liker, liked: body.liked} },
            { upsert: true },
            (err, updated) => {

                if(err)
                    {
                        console.log(err);
                        return sendErrorResponse(res, {}, 'Something went wrong, please try again');
                    }
                    return sendSuccessResponse(res, {}, 'User has been Liked');

        });

    }else{
        return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
    }
}

exports.likes = (req, res)  => {

    likedHistory.aggregate([
        {$match: {liked: req.params.memberId}}, 
        {$sample: {size: 8} },
        {$lookup: {from: 'users', foreignField: 'memberId', localField: 'liker', as: 'liker'}},
        {$unwind: '$liker'},

    ], (err, result) => {
        console.log(err);
        if (err) 
        {
            return sendErrorResponse(res, {}, 'Something went wrong, please try again');
        }

        Users.findOne( {nickname: req.payload.nickname}, (err, result2) => 
        {
               
        number  = result.length;
        return sendSuccessResponse(res, {count: number, subscriptionStatus: result2.subscriptionStatus, result}, 'details');

        });
    });  
}


exports.reportUser = (req, res) =>{

    let required = [
        {name: 'reporter', type: 'string'},
        {name: 'reported', type: 'string'},
        {name: 'reason', type: 'string'},
    ];
    
    req.body = trimCollection(req.body);
    const body = req.body;
    
    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {


        let nReport         = new report();
        nReport.reporter     = body.reporter;
        nReport.reported     = body.reported;
        nReport.reason      = body.reason;
        
        console.log(req.body);
        nReport.save((err) => {
            console.log(err);
            if (err) {
                console.log(err);
                return sendErrorResponse(res, {}, 'Something went wrong');
            }
            return sendSuccessResponse(res, '', 'We have received your report, We\'ll look into it');
         });

    }else{
        return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
    }

}


exports.toogleSubscription = (req, res) => {
    let required = [
        {name: 'status', type: 'string'},
    ];
    
    req.body = trimCollection(req.body);
    const body = req.body;
    
    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {

       Users.updateOne(
        { email: req.payload.email }, {
        $set: {
            SubscriptionStatus: body.status,
        },
    }, (err, updated) => {
       
        if (err) {
            console.log(err);
            return sendErrorResponse(res, {}, 'Something went wrong, please try again');
        }
        if (updated && updated.nModified) {
            return sendSuccessResponse(res, { }, 'Status Updated!');
        }else{
            return sendSuccessResponse(res, { }, 'Status Already Updated!');
        }
    });
     
   }else{
    return sendErrorResponse(res, {}, 'Some fields are missing');
   }
}

exports.getChatHistory = (req, res) => {
    if(req.params.memberId){

        let arr2 = [];

       
        ChatHistory.find( {$or: [ { to: req.params.memberId }, { from: req.params.memberId } ] }, (err, result) => 
        {

               if (err)
                {
                    console.log(err);
                    return sendErrorResponse(res, {}, 'Something went wrong, please try again');
                }
              

                for (i = 0; i < result.length; i++) {
                 
                    if(result[i].from === req.params.memberId){

                        Users.findOne( { memberId: result[i].to }, (err, result) => 
                        {

                            
                            arr2.push(result);
                            console. log(arr2, "result22");

                        });

                        
                    }else{

                        Users.findOne( { memberId: result[i].from }, (err, result2) => 
                        {
                            arr2.push(result2);
                           // console. log(arr2, "result24");

                           
                        });
                    }
                }
              
                sendSuccessResponse(res, {arr2}, "data");
               
        });


        // ChatHistory.aggregate([
        
        //     {$match: {
        //         $or: [ { to: req.params.memberId }, { from: req.params.memberId } ]
        //     }},

        //     {$lookup: {from: 'users', foreignField: 'memberId', localField: 'to', as: 'to'}},
        //     {$unwind: "$to"},

        //     {$lookup: {from: 'users', foreignField: 'memberId', localField: 'from', as: 'from'}},
        //     {$unwind: "$from"},

        //     {$lookup: {from: 'blockedusershistories', foreignField: 'blocked', localField: 'memberId', as: 'blockedStatus'}},

        // ], (err, users) => {
        //       if (err) {  
        //         console.log(err);  
        //         return sendErrorResponse(res, {}, 'Something went wrong');
        //     }
        //       return sendSuccessResponse(res, users, 'Your chat history');
        // });



        

    }else
    {
      return sendErrorResponse(res, {}, 'MemberId is required');
    }
}


exports.getBlockedHistory = (req, res) =>{
    if(req.params.memberId){

        BlockedUser.aggregate([
            {$match: {blocker: req.params.memberId}},
            {$lookup: {from: 'users', foreignField: 'memberId', localField: 'blocked', as: 'blockedHistory'}},
           
        ], (err, users) => {
              if (err) {  
                console.log(err);  
                return sendErrorResponse(res, {}, 'Something went wrong');
            }
              return sendSuccessResponse(res, users, 'Your history');
        });
    }else
    {
      return sendErrorResponse(res, {}, 'MemberId is required');
    }
}

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

exports.viewedYou = (req, res)  => {
   
        Users.aggregate([ 
            {$sample: {size: 8} },
        ], (err, result) => {
            console.log(err);
            if (err) 
            {
                return sendErrorResponse(res, {}, 'Something went wrong, please try again');
            }
            return sendSuccessResponse(res, result, 'users');   
        });  

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
            {$match: {
                'email': {
                    $ne: req.payload.email ,
                }
            }
            }, 
            {$sample: {size: 10} },
            {$lookup: {from: 'blockedusershistories', foreignField: 'blocked', localField: 'memberId', as: 'blockedStatus'}},
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
        {$match: {
            'email': {
                $ne: req.payload.email ,
            }
        }
        },
        {$sample: {size: 10} },
        {$lookup: {from: 'blockedusershistories', foreignField: 'blocked', localField: 'memberId', as: 'blockedStatus'}},
    
    ], (err, popular) => {
        console.log(err);
        if (err) 
        {
            return sendErrorResponse(res, {}, 'Something went wrong, please try again');
        }

        return sendSuccessResponse(res, {popular}, 'Popular users');   
    });  
    
    
}




function tripFilter (query) {

    let {
        limit, 
    } = {...query};

    let requestMatch = {},
        tripMatch = {},
        fleetMatch = {},
        assetMatch = {},
        sortOptions = {sortBy: 'startDate', sortOrder: -1},
        routeMatch = {};

    //todo: filter parnter and customer trip using tripMatch

    if (startDate) {
        //TOdo: Can be optimized
        const sD = new Date(startDate);
        const sDateAfter = new Date(new Date().setDate(sD.getDate() + 1));
        if (deliveryDate) {
            const eD = new Date(deliveryDate);
            const eDateAfter = new Date(new Date().setDate(eD.getDate() + 1));
            tripMatch['$and'] = [{'startDate': {'$gt': sD, '$lt': sDateAfter}}, {'deliveryDate': {'$gt': eD, '$lt': eDateAfter}}];
        } else {
            console.log(new Date(sDateAfter));
            tripMatch['startDate'] = {'$gt': sD, '$lt': sDateAfter};
        }

    } else if (deliveryDate) {
        const eD = new Date(deliveryDate);
        const eDateAfter = new Date(new Date().setDate(eD.getDate() + 1));
        tripMatch['deliveryDate'] = {'$gt': eD, '$lt': eDateAfter};
    }
    if (route) {
        tripMatch['route'] = new ObjectId(route);
    }
    if (assetClass) {
        tripMatch['assetClass'] = new ObjectId(assetClass);
    }

   
    return {};
}