const express = require('express');

const router = express.Router();

router.use('/schedule-recommend', require('./scheduleRecommend.test.js'));

module.exports = router;
