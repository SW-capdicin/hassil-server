const path = require('path');

const envConfig = stage => ({ path: path.join(__dirname, `.env${stage ? `.${stage}` : ''}`) })

require('dotenv').config(envConfig(process.env.NODE_ENV))

module.exports = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};
