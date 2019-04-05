
const {validParam, sendErrorResponse, sendSuccessResponse} = require('../../helpers/utility');
let router = require('express').Router();
let controller = require('./controller');

router.get('/l', controller.firstMethod);

router.post('/auth', controller.auth);
router.post('/register', controller.register);


module.exports = router;