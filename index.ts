import express from 'express';
import { bot } from './src/bot';
import packageInfo from './package.json';
import { ENV } from './src/adapters/environment-variables';

const app = express();
const PORT = parseInt(ENV.PORT);
app.listen(PORT, ENV.HOST, () => {
  console.log(`Web server started at http://${ENV.HOST}:${PORT}`);
});

app.post(`/${ENV.BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

console.log(`Bot server started. Version: ${packageInfo.version}. Production mode: ${ENV.IS_PRODUCTION_MODE}`);
