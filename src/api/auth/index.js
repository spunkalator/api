
const {validParam, sendErrorResponse, sendSuccessResponse} = require('../../helpers/utility');
let router = require('express').Router();
let controller = require('./controller');

router.post('/', controller.auth);
router.post('/authWithToken', controller.authWithToken);
router.post('/register', controller.register);
router.post('/forgotPassword', controller.forgotPassword);

router.post('/resetPassword/:code', controller.resetPassword);


module.exports = router;