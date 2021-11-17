require('dotenv').config()

module.exports = {
  port: process.env.PORT || 3000,
  isProduction: process.env.NODE_ENV === 'production',
  apiVersion: process.env.API_VERSION || 1,
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'my-secret',
  mongo: {
    content_type: process.env.MONGO_CONTENT_TYPE,
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    dbName:  process.env.MONGO_DB_NAME,
    options: {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS
    }
  },
  tokenType: process.env.TOKEN_TYPE,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
}