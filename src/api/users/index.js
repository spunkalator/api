
const {validParam, sendErrorResponse, sendSuccessResponse} = require('../../helpers/utility');
let router = require('express').Router();
let controller = require('./controller');

router.post('/editProfile', controller.editProfile)
router.get('/profile/:nickname', controller.profileDetails)
router.post('/nearby', controller.nearbyUsers)
router.post('/updateLocation', controller.updateLocation)

module.exports = router;