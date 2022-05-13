const express = require('express');

const router = express.Router();

router.use('/users', require('./user'));
router.use('/payment', require('./payment'));
router.use('/studies', require('./study'));
router.use('/upload', require('./upload'));
router.use('/reservations', require('./reservation'));

module.exports = router;
