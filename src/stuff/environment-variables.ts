const { DATABASE_PATH, PORT, HOST, NODE_ENV, DEV_BOT_TOKEN, PROD_BOT_TOKEN } = process.env;

if (DATABASE_PATH === undefined) {
  throw new Error('Environment variable DATABASE_PATH is not set.');
}
if (PORT === undefined) {
  throw new Error('Environment variable PORT is not set.');
}
if (HOST === undefined) {
  throw new Error('Environment variable HOST is not set.');
}
if (NODE_ENV === undefined) {
  throw new Error('Environment variable NODE_ENV is not set.');
}
if (DEV_BOT_TOKEN === undefined) {
  throw new Error('Environment variable DEV_BOT_TOKEN is not set.');
}
if (PROD_BOT_TOKEN === undefined) {
  throw new Error('Environment variable PROD_BOT_TOKEN is not set.');
}

const IS_PRODUCTION_MODE = Boolean(NODE_ENV === 'production');
const BOT_TOKEN = IS_PRODUCTION_MODE ? PROD_BOT_TOKEN : DEV_BOT_TOKEN;

export const ENV = { DATABASE_PATH, PORT, HOST, IS_PRODUCTION_MODE, BOT_TOKEN };