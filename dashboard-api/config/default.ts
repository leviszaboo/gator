import "dotenv/config";

export default {
  port: process.env.PORT || 3001,
  DB: {
    dbHost: process.env.DB_HOST || "127.0.0.1",
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
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