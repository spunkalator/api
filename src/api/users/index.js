
const {validParam, sendErrorResponse, sendSuccessResponse} = require('../../helpers/utility');
let router = require('express').Router();
let controller = require('./controller');


router.post('/editProfile', controller.editProfile)
router.post('/editGD', controller.editGD)

router.get('/profile/:nickname', controller.profileDetails)
router.post('/updateLocation', controller.updateLocation)
router.post('/changePassword', controller.changePassword);
router.post('/updateUserStatus', controller.updateUserStatus)


module.exports = router;