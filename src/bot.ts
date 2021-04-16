
import TelegramBot, { CallbackQuery, Message } from 'node-telegram-bot-api';
import { ENV } from './adapters/environment-variables';
import { addListItems, checkListItem, removeCheckedItems, showHelpMessage, showList, updateListButtons } from './usecases';

export const bot = new TelegramBot(ENV.BOT_TOKEN, { polling: true });

bot.onText(/^\/(L|l)ist(e)?.*/, async (message: Message) => {
  await addListItems(message.chat.id, message.text);
  await removeCheckedItems(message.chat.id);
  await showList(message.chat.id, message.message_id, bot);
});

bot.onText(/^\/(H|h)elp.*/, async (message: Message) => {
  await showHelpMessage(message.chat.id, message.message_id, bot);
});

bot.on('callback_query', async (query: CallbackQuery) => {
  await checkListItem(query.data);
  await updateListButtons(query.id, query.message, bot);
});
