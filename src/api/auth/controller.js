
const {validParam, sendErrorResponse, sendEmail, sendSuccessResponse, generateId, trimCollection} = require('../../helpers/utility');
const mongoose = require('mongoose');
const Users = mongoose.model('User');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const nodemailer = require('nodemailer');



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
                        const options = { expiresIn: '90d'};
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
        {name: 'nickname', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'token', type: 'string'},
       
       
    ];
    
    req.body = trimCollection(req.body);
    const body = req.body;
    console.log(req.body);

    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {

        Users.findOne( {nickname: body.nickname}, (err, result) => 
            {
                if (err)
                {
                    console.log(err);
                    return sendErrorResponse(res, {}, 'Something went wrong, please try again');
                }
                if (result) {
                    
                        const payload = { nickname: result.nickname, email: result.email };
                        const options = { expiresIn: '90d'};
                        const secret = process.env.JWT_SECRET;
                        const token = jwt.sign(payload, secret, options);

                        return sendSuccessResponse(res, {token: token, user: result}, 'Login successful');
                }else{
                    
                    let nUser       = new Users();
                    nUser.nickname  = body.nickname;
                    nUser.email     = body.email;
                    nUser.gender    = "";
                    nUser.dob       = ""
                  
                    nUser.token     = body.token;
                    nUser.memberId  = generateId(15);
                    nUser.defaultImage = "";
                    nUser.subscriptionStatus = "invalid"

                    const payload = { nickname: body.nickname, email: body.email };
                    const options = { expiresIn: '90d'};
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
        {name: 'dob', type: 'string'}, 
        {name: 'image', type: 'string'}
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
                    nUser.memberId  = generateId(15);
                    nUser.defaultImage = "";
                    nUser.subscriptionStatus = "invalid";
                    nUser.dob                = body.dob;
                    nUser.gender             = body.gender;
                    nUser.defaultImage       = body.image;

                    const payload = { nickname: body.nickname, email: body.email };
                    const options = { expiresIn: '90d'};
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

                  
                    let code =  generateId(6);
                    
                    Users.updateOne(
                        { email: body.email}, {
                        $set: {
                            forgotPassword:code,
                        },
                    }, (err, updated) => {
                      
                        if (err) {
                            console.log(err);
                            return sendErrorResponse(res, {}, 'Something went wrong, please try again');
                        }
                        sendEmail(body.email, code, 'ZingaAm Forgot Pin');
                        if (updated && updated.nModified) {

                            return sendSuccessResponse(res, {}, 'A code has been sent to your email');
                        } else {
                            return sendSuccessResponse(res, {}, 'A code has been sent to your email');
                        }
                    });
                }
            }else{
                return sendErrorResponse(res, {}, 'We can\'t seem to find that email, please check again ');
            }
        });


    }else{
        return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
    }


}

exports.verifyForgotPasswordCode = (req, res) =>
{
    let required = [
        {name: 'email', type: 'string'},
        {name: 'code', type: 'string'},
    ];

     req.body = trimCollection(req.body);
     const body = req.body;
     console.log(req.body, "body");

     let hasRequired = validParam(req.body, required);
     if (hasRequired.success) {

        Users.findOne({email: body.email, forgotPassword: body.code}, (err, result) => 
        {
                if (err)
                {
                    console.log(err);
                    return sendErroResponse(res, {}, 'Something went wrong, Please try again');
                }
                if (result != null) {

                     return sendSuccessResponse(res, {}, 'Code is valid');
   
                }else{
                    return sendErrorResponse(res, {}, 'Code is invalid');
                }
        });
     }else{
        return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
     }
}

exports.setNewPassword = (req, res) =>
{
    let required = [
        {name: 'password', type: 'string'},
        {name: 'email', type: 'string'}
    ];

     req.body = trimCollection(req.body);
     const body = req.body;
     console.log(req.body, "body");

     let hasRequired = validParam(req.body, required);
     if (hasRequired.success) {
       
        Users.updateOne({email: body.email}, {
            $set: {
                forgotPassword: body.password,
            },
        }, (err, updated) => {
            if (err) {
                console.log(err);
                return sendErrorResponse(res, {}, 'Something went wrong, please try again');
            }
            if (updated && updated.nModified) {
                return sendSuccessResponse(res, {}, 'Password Changed Successfully, you may login');
            } else {
                return sendSuccessResponse(res, {}, 'Password Changed Successfully, you may login');
            }
        });
    
  }else{
    return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
  } 

}
