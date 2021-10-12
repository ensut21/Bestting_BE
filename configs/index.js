require('dotenv').config()

module.exports = {
  port: process.env.PORT || 3000,
  isProduction: process.env.NODE_ENV === 'production',
  apiVersion: process.env.API_VERSION || 1,
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'my-secret',
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dbName:  process.env.POSTGRES_DB_NAME,
    options: {
      user: process.env.POSTGRES_USER,
      pass: process.env.POSTGRES_PASS
    }
  },
  tokenType: process.env.TOKEN_TYPE,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
}