const { config } = require("dotenv");
config();

module.exports = {
  API_SECRET: process.env.API_SECRET,
  SMTP_USERNAME: process.env.SMTP_USERNAME,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_NAME: process.env.DB_NAME || "riparo",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "root",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_DIALECT: process.env.DB_DIALECT || "mysql",
  DB_OPERATOR_ALIASES: process.env.DB_OPERATOR_ALIASES || false,
};
