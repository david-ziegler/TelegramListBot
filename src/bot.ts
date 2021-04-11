
import TelegramBot, { CallbackQuery, EditMessageTextOptions, Message, SendMessageOptions } from 'node-telegram-bot-api';
import { InlineKeyboard, InlineKeyboardButton, Row } from 'node-telegram-keyboard-wrapper';
import packageInfo from '../package.json';
import { DB } from './db';
import { i18n } from './i18n';
import { ListItem } from './models';
import { ENV } from './stuff/environment-variables';

const db = new DB();
export const bot = new TelegramBot(ENV.BOT_TOKEN, { polling: true });
console.log(`Bot server started. Version: ${packageInfo.version}. Production mode: ${ENV.IS_PRODUCTION_MODE}`);

bot.onText(/^\/(L|l)ist(e)?.*/, async (message: Message) => {
  const chat_id = message.chat.id;
  await addListItemsIfPresent(chat_id, message.text);
  const buttons = await listItemButtons(chat_id);
  await sendMessage(chat_id, buttons);
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

async function addListItemsIfPresent(chat_id: number, text?: string): Promise<void> {
  if (text === undefined) {
    throw new Error('Tried to add an item to the list but message.text is undefined,');
  }
  const new_items_text = removeBotCommand(text);
  if (new_items_text === '') {
    return;
  }
  const new_items = new_items_text.split(/\n/);
  const items_trimmed = new_items.map(item => item.trim());
  await db.insertListItems(chat_id, items_trimmed);
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
      reply_markup: buttons.length > 0 ? buttons.getMarkup() : undefined,
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
    reply_markup: buttons.length > 0 ? buttons.getMarkup() : undefined,
  };
  return bot.sendMessage(chat_id, i18n.message_text, options);
}

function removeBotCommand(text: string): string {
  return text.replace(/^\/(L|l)ist(e)?/, '');
}
