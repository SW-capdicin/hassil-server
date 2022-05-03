const express = require('express');

const router = express.Router();

router.use('/users', require('./user'));
router.use('/payment', require('./payment'));
router.use('/studies', require('./study'));


module.exports = router;
