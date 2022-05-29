const express = require('express');

const router = express.Router();

router.use('/scheduleRecommend', require('./scheduleRecommend.test.js'));

module.exports = router;
