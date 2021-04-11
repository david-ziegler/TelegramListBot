
import TelegramBot, { CallbackQuery, Message } from 'node-telegram-bot-api';
import { ENV } from './adapters/environment-variables';
import { addListItems, removeListItem, showList, updateListButtons } from './usecases';

export const bot = new TelegramBot(ENV.BOT_TOKEN, { polling: true });

bot.onText(/^\/(L|l)ist(e)?.*/, async (message: Message) => {
  await addListItems(message.chat.id, message.text);
  await showList(message.chat.id, bot);
});

bot.on('callback_query', async (query: CallbackQuery) => {
  await removeListItem(query.data);
  await updateListButtons(query.id, query.message, bot);
});
