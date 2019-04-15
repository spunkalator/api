
const {validParam, sendErrorResponse, sendSuccessResponse} = require('../../helpers/utility');
let router = require('express').Router();
let controller = require('./controller');

router.post('/editProfile', controller.editProfile)
router.post('/profile/:nickname', controller.profileDetails)

module.exports = router;