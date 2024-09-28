const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  googleApiKey: process.env.GOOGLE_API_KEY,
};