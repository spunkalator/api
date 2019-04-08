
const {validParam, sendErrorResponse, sendSuccessResponse} = require('../../helpers/utility');
let router = require('express').Router();
let controller = require('./controller');

router.post('/', controller.auth);
router.post('/register', controller.register);

module.exports = router;