import TelegramBot, { CallbackQuery, EditMessageTextOptions } from 'node-telegram-bot-api';
import { InlineKeyboard, InlineKeyboardButton, Row } from 'node-telegram-keyboard-wrapper';
import { DB } from './adapters/db';
import * as telegram from './adapters/telegram';
import { extractListItemTexts } from './core';
import { i18n } from './i18n';
import { ListItem } from './models';

const db = new DB();

export async function addListItems(chat_id: number, message_text: string | undefined): Promise<void> {
  if (message_text === undefined) {
    throw new Error('Tried to add an item to the list but message_text is undefined,');
  }
  const item_texts = extractListItemTexts(message_text);
  await db.insertListItems(chat_id, item_texts);
}

export async function showList(chat_id: number, bot: TelegramBot): Promise<void> {
  const buttons = await listItemButtons(chat_id);
  await telegram.sendMessage(chat_id, buttons, i18n.message_text, bot);
}

async function listItemButtons(chat_id: number): Promise<InlineKeyboard> {
  const previous_items = await db.getAllItemsForChat(chat_id);
  const buttons = new InlineKeyboard();
  previous_items.forEach((item: ListItem) => addButton(buttons, item.id, item.text));
  return buttons;
}

function addButton(buttons: InlineKeyboard, id: number, text: string) {
  buttons.push(new Row(new InlineKeyboardButton(text, 'callback_data', id.toString())));
}

export async function removeListItem(query: CallbackQuery): Promise<void> {
  if (query.message === undefined) {
    throw new Error(`Tried to remove a list item, but query doesn't have a message object. Query: ${query}`);
  }
  const id_to_remove = parseItemId(query.data);
  await db.removeListItem(id_to_remove);
}

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

export async function updateListButtons(query: CallbackQuery, bot: TelegramBot): Promise<void> {
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
