
const {validParam, sendErrorResponse, sendSuccessResponse} = require('../../helpers/utility');
let router = require('express').Router();
let controller = require('./controller');



router.get('/quickmatch/:n', controller.quickmatch);
router.get('/popular', controller.popular);
router.post('/nearby', controller.nearbyUsers)
router.post('/like/:username', controller.likeUser);

router.post('/viewedYou', controller.viewedYou);
router.post('/likes/:memberId', controller.likes);

router.post('/blockUser', controller.blockUser);

router.post('/reportUser', controller.reportUser);

router.post('/toogleSubscription', controller.toogleSubscription);
router.post('/logChatHistory', controller.logChatHistory);
router.get('/getChatHistory/:memberId', controller.getChatHistory);

router.get('/getBlockedHistory/:memberId', controller.getBlockedHistory);

module.exports = router;