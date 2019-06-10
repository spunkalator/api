
const {validParam, sendErrorResponse, sendSuccessResponse, trimCollection} = require('../../helpers/utility');
const mongoose = require('mongoose');
const Users = mongoose.model('User');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');

exports.auth = (req, res, next) => {

    let required = [
        {name: 'identity', type: 'string'},
        {name: 'password', type: 'string'},
       
    ];
    
    req.body = trimCollection(req.body);
    const body = req.body;
    console.log(req.body);

    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {

        Users.findOne({$or:[ {nickname: body.identity},{email: body.identity}]}, (err, result) => 
            {
                if (err)
                {
                    console.log(err);
                    return sendErrorResponse(res, {}, 'Something went wrong, please try again');
                }
                if (result) {
                    console.log(result,"res");

                    if(bcrypt.compareSync(body.password, result.password )) {


                        const payload = { nickname: result.nickname, email: result.email };
                        const options = { expiresIn: '2d'};
                        const secret = process.env.JWT_SECRET;
                        const token = jwt.sign(payload, secret, options);

                        return sendSuccessResponse(res, {token: token, user: result}, 'Login successful');
                        
                    } else {
                        return sendErrorResponse(res, {}, 'Incorrect password, please try again');
                        }
                }else{
                    return sendErrorResponse(res, {}, 'Sorry we can\'t find anyone with those details');
                }
            });
    }else{
        return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
    }
};

exports.authWithToken = (req, res, next) => {

    let required = [
        {name: 'email', type: 'string'},
        {name: 'token', type: 'string'},
       
    ];
    
    req.body = trimCollection(req.body);
    const body = req.body;
    console.log(req.body);

    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {

        Users.findOne( {email: body.email}, (err, result) => 
            {
                if (err)
                {
                    console.log(err);
                    return sendErrorResponse(res, {}, 'Something went wrong, please try again');
                }
                if (result) {
                    
                        const payload = { nickname: result.nickname, email: result.email };
                        const options = { expiresIn: '2d'};
                        const secret = process.env.JWT_SECRET;
                        const token = jwt.sign(payload, secret, options);

                        return sendSuccessResponse(res, {token: token, user: result}, 'Login successful');
                }else{
                    
                    let nUser       = new Users();
                    nUser.email     = body.email;
                    nUser.token     = body.token;

                    const payload = { email: body.email };
                    const options = { expiresIn: '2d'};
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret, options);
                
                    console.log(req.body);
                    nUser.save((err) => {
                        console.log(err);
                        if (err) {
                            console.log(err);
                            return sendErrorResponse(res, {}, 'Something went wrong');
                        }
                        return sendSuccessResponse(res, {token: token, user: nUser}, 'User registered');
                     });

                }
            });
    }else{
        return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
    }
};

exports.register = (req, res, next) => {
    let required = [
        {name: 'nickname', type: 'string'},
        {name: 'gender', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'password', type: 'string'},
       
    ];

    req.body = trimCollection(req.body);
    const body = req.body;
    console.log(req.body);

    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {

        Users.find({email: req.body.email}, function (err, result) {
            if (err) {
                return sendErrorResponse(res, {err}, 'Something went wrong');
            }
            if (result && result.length > 0) {
                return sendErrorResponse(res, {result : result.password}, 'Someone else has registered with that email');
            }else{

              Users.find({nickname: req.body.nickname}, function (err, result) {

                    if (err) {
                        return sendErrorResponse(res, {err}, 'Something went wrong');
                    }
                    if (result && result.length > 0) {
                        return sendErrorResponse(res, {}, 'Someone else has registered with that nickname');
                    }else{
                    
                   


                    let nUser       = new Users();
                    let hash        = bcrypt.hashSync(body.password, 10);
                    nUser.nickname  = body.nickname;
                    nUser.email     = body.email;
                    nUser.password  = hash;

                    const payload = { nickname: body.nickname, email: body.email };
                    const options = { expiresIn: '2d'};
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret, options);
                
                    console.log(req.body);
                    nUser.save((err) => {
                        console.log(err);
                        if (err) {
                            return sendErrorResponse(res, {err}, 'Something went wrong');
                        }
                        return sendSuccessResponse(res, {token: token, user: nUser}, 'User registered');
                     });
                   }                
            });   
           }
        });
    }else{
        return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
    } 
}

exports.registerWithToken = (req, res, next) => {
    let required = [
        {name: 'nickname', type: 'string'},
        {name: 'gender', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'token', type: 'string'},
       
    ];

    req.body = trimCollection(req.body);
    const body = req.body;
    console.log(req.body);

    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {

        Users.find({email: req.body.email}, function (err, result) {
            if (err) {
                return sendErrorResponse(res, {err}, 'Something went wrong');
            }
            if (result && result.length > 0) {
                return sendErrorResponse(res, {result : result.password}, 'Someone else has registered with that email');
            }else{

              Users.find({nickname: req.body.nickname}, function (err, result) {

                    if (err) {
                        return sendErrorResponse(res, {err}, 'Something went wrong');
                    }
                    if (result && result.length > 0) {
                        return sendErrorResponse(res, {}, 'Someone else has registered with that nickname');
                    }else{
                    
                   


                    let nUser       = new Users();
                    //let hash        = bcrypt.hashSync(body.password, 10);
                    nUser.nickname  = body.nickname;
                    nUser.email     = body.email;
                    //nUser.password  = hash;
                    nUser.token     = body.token;

                    const payload = { nickname: body.nickname, email: body.email };
                    const options = { expiresIn: '2d'};
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret, options);
                
                    console.log(req.body);
                    nUser.save((err) => {
                        console.log(err);
                        if (err) {
                            return sendErrorResponse(res, {err}, 'Something went wrong');
                        }
                        return sendSuccessResponse(res, {token: token, user: nUser}, 'User registered');
                     });
                   }                
            });   
           }
        });
    }else{
        return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
    } 
}



exports.forgotPassword = (req, res) =>
{
    let required = [
        {name: 'email', type: 'string'},
      
       
    ];
    
    req.body = trimCollection(req.body);
    const body = req.body;
    console.log(req.body);

    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {

        Users.findOne({email: body.email}, (err, result) => 
        {
            if (err)
            {
                console.log(err);
                return sendErrorResponse(res, {}, 'Something went wrong, please try again');
            }
            if (result) {
                if(result.email == body.email ){
                    return sendSuccessResponse(res, {}, 'Please check your email, a reset link has been sent');

                }
                
               
            }else{
                return sendErrorResponse(res, {}, 'We can\'t seem to find that email, please check again ');
            }
        });


    }else{
        return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
    }


}
