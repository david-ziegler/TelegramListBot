
import TelegramBot, { CallbackQuery, EditMessageTextOptions, Message, SendMessageOptions, User } from 'node-telegram-bot-api';
import { InlineKeyboard, InlineKeyboardButton, Row } from 'node-telegram-keyboard-wrapper';
import packageInfo from '../package.json';
import { DB } from './db';
import { i18n } from './i18n';
import { ListItem } from './models';
import { ENV } from './stuff/environment-variables';

/* TODO:
 - löschen mit zeitverzögerung
*/

const db = new DB();
export const bot = new TelegramBot(ENV.BOT_TOKEN, { polling: true });
console.log(`Bot server started. Version: ${packageInfo.version}. Production mode: ${ENV.IS_PRODUCTION_MODE}`);

bot.onText(/^\/list*/, async (message: Message) => {
  await addListItem(message.chat.id, message.text, message.from);
});

bot.on('callback_query', async (query: CallbackQuery) => {
  if (query.message === undefined) {
    throw new Error(`Tried to remove a list item, but query doesn't have a message object. Query: ${query}`);
  }
  const id_to_remove = parseItemId(query.data);
  await db.removeListItem(id_to_remove);
  updateListButtons(query);
});

function parseItemId(query_data: string | undefined): number {
  if (query_data === undefined) {
    throw new Error('Tried to remove a list item but "data"-object of the button-click-query is undefined. Expected: the ID of the item to remove.');
  }
  const id = parseInt(query_data);
  if (Number.isNaN(id)) {
    throw new Error(`Tried to remove a list item but "data"-object of the button-click-query is not a number. Expected: the ID of the item to remove. Actual: ${query_data}`);
  }
  return id;
}

async function addListItem(chat_id: number, text?: string, from?: User): Promise<void> {
  if (text === undefined || from === undefined) {
    throw new Error(`Tried to add to a list but 'text' or 'from' is empty: text=${text}, from=${from}`);
  }
  const new_item_text = removeBotCommand(text);
  await db.insertListItem(chat_id, new_item_text);
  const buttons = await listItemButtons(chat_id);
  await sendMessage(chat_id, buttons);
}

async function updateListButtons(query: CallbackQuery) {
  const { message } = query;
  if (message === undefined) {
    throw new Error('Tried to update the list-buttons but "query.message" is undefined.');
  }
  const buttons = await listItemButtons(message.chat.id);

  bot.answerCallbackQuery(query.id, { text: '' }).then(async () => {
    const options: EditMessageTextOptions = {
      chat_id: message.chat.id,
      message_id: message.message_id,
      parse_mode: 'MarkdownV2',
      reply_markup: buttons.getMarkup(),
    };
    bot.editMessageText(i18n.message_text, options);
  });
}

async function listItemButtons(chat_id: number): Promise<InlineKeyboard> {
  const previous_items = await db.getAllItemsForChat(chat_id);
  const buttons = new InlineKeyboard();
  previous_items.forEach((item: ListItem) =>
    addButton(buttons, item.id, item.text),
  );
  return buttons;
}

function addButton(buttons: InlineKeyboard, id: number, text: string) {
  buttons.push(new Row(new InlineKeyboardButton(text, 'callback_data', id.toString())));
}

async function sendMessage(chat_id: number, buttons: InlineKeyboard) {
  const options: SendMessageOptions = {
    parse_mode: 'MarkdownV2',
    reply_markup: buttons.getMarkup(),
  };
  return bot.sendMessage(chat_id, i18n.message_text, options);
}

function removeBotCommand(text: string): string {
  return text.replace(/^\/list/, '');
}
