import { configDotenv } from 'dotenv';

configDotenv();

export const ENV = {
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
  REPL: process.env.REPL == 'true',
  APP_NAME: process.env.APP_NAME || 'EXAMPLE_NAME',
  APP_PORT: process.env.APP_PORT,
  RMQ_URL: process.env.RMQ_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  ZENSIVA_API_URL: process.env.ZENSIVA_API_URL,
  ZENSIVA_API_KEY: process.env.ZENSIVA_API_KEY,
  ZENSIVA_USER_KEY: process.env.ZENSIVA_USER_KEY,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  S3_REGION: process.env.S3_REGION,
};
