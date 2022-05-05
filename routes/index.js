const express = require('express');

const router = express.Router();

router.use('/users', require('./user'));
router.use('/studies', require('./study'));
router.use('/upload', require('./upload'));

module.exports = router;
