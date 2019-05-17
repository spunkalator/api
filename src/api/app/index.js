
const {validParam, sendErrorResponse, sendSuccessResponse} = require('../../helpers/utility');
let router = require('express').Router();
let controller = require('./controller');



router.get('/quickmatch', controller.quickmatch);
router.get('/popular', controller.popular);

router.post('/like/:username', controller.likeUser);

module.exports = router;