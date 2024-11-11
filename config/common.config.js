require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  DB_URI: process.env.DB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiredIn: process.env.JWT_EXPIRED_IN || "365d",
    jwtRefreshExpiration: 86400,
  },
 
  app: {
    url: process.env.APP_URL,
  }
};