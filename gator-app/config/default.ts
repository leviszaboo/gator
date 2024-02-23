import "dotenv/config";

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
DB: {
    dbHost: process.env.MYSQL_HOST,
    dbUser: process.env.MYSQL_USER,
    dbPassword: process.env.MYSQL_ROOT_PASSWORD,
    dbName: process.env.MYSQL_DATABASE,
  },
  JWT: {
    jwtAccessTokenPrivateKey: process.env.ACT_PRIVATE_KEY,
    jwtAccessTokenPublicKey: process.env.ACT_PUBLIC_KEY,
    jwtRefreshTokenPrivateKey: process.env.RFT_PRIVATE_KEY,
    jwtRefreshTokenPublicKey: process.env.RFT_PUBLIC_KEY,
    accessTokenExpiresIn: "5m",
    refreshTokenExpiresIn: "30m"
  }
};