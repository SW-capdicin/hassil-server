const envConfig = stage => ({ path: `../.env${stage ? `.${stage}` : ''}` })

require('dotenv').config(envConfig(process.env.NODE_ENV));

console.log(process.env.NODE_ENV);
console.log(process.env.GOOGLE_CALLBACK_URL);

module.exports = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};
