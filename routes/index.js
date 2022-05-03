const express = require('express');

const router = express.Router();

router.use('/users', require('./user'));
router.use('/studies', require('./study'));

module.exports = router;
