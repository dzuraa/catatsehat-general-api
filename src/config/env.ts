import { configDotenv } from 'dotenv';

configDotenv();

export const ENV = {
  REPL: process.env.REPL == 'true',
  APP_NAME: process.env.APP_NAME || 'EXAMPLE_NAME',
  APP_PORT: process.env.APP_PORT,
  RMQ_URL: process.env.RMQ_URL,
};
