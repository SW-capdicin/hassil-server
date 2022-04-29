const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get(
  '/users/google',
  passport.authenticate('google', { scope: ['email'] }),
);
router.get(
  '/users/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    // db
    // req.user.nickname
    //   ? res.redirect('http://localhost:3000')
    //   : res.redirect('http://localhost:3000/users/signup');
    res.redirect('http://localhost:3000');
  },
);

module.exports = router;
