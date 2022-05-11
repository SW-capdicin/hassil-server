require('dotenv').config();

console.log(process.env.GOOGLE_CLIENT_ID);
console.log(process.env.GOOGGOOGLE_CALLBACK_URLLE_CLIENT_ID);

module.exports = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};
