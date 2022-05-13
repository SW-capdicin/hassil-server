require('dotenv').config();

module.exports = {
  httpOnly: true,
  key: 'sid',
  resave: false,
  saveUninitialized: true,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    maxAge: 24000 * 60 * 60,
  },
};
