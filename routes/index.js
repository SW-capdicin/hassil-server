const express = require('express');

const router = express.Router();

router.use('/users', require('./user'));
router.use('/payment', require('./payment'));
router.use('/studies', require('./study'));
router.use('/upload', require('./upload'));
router.use('/reservations', require('./reservation'));
router.use('/schedule-recommend', require('./scheduleRecommend').router);
router.use('/study-cafes', require('./studyCafe'));
router.use('/study-room-schedules', require('./studyRoomSchedule'));

module.exports = router;
