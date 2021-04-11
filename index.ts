import express from 'express';
import { bot } from './src/bot';
import { ENV } from './src/stuff/environment-variables';

const app = express();
const PORT = parseInt(ENV.PORT);
app.listen(PORT, ENV.HOST, () => {
  console.log(`Web server started at http://${ENV.HOST}:${PORT}`);
});

app.post(`/${ENV.BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
