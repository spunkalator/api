
const {validParam, sendErrorResponse, sendSuccessResponse} = require('../../helpers/utility');
let router = require('express').Router();
let controller = require('./controller');



router.get('/quickmatch/:n', controller.quickmatch);
router.get('/popular', controller.popular);
router.post('/nearby', controller.nearbyUsers)
router.post('/like/:username', controller.likeUser);

module.exports = router;