import TelegramBot, { Message } from 'node-telegram-bot-api';
import { InlineKeyboard } from 'node-telegram-keyboard-wrapper';
import { BOOL, DB } from './adapters/db';
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

export async function showList(chat_id: number, message_id: number, bot: TelegramBot): Promise<void> {
  const buttons = await listItemButtons(chat_id);
  await telegram.replaceMessage(chat_id, message_id, i18n.message_text, bot, buttons);
}

export async function showHelpMessage(chat_id: number, message_id: number, bot: TelegramBot): Promise<void> {
  await telegram.replaceMessage(chat_id, message_id, i18n.help_text, bot);
}

export async function checkListItem(item_id: string | undefined): Promise<void> {
  if (item_id === undefined) {
    throw new Error('Tried to check a list item but item_id is undefined.');
  }
  const id_to_remove = parseItemId(item_id);
  await db.checkListItem(id_to_remove);
}

function parseItemId(item_id: string): number {
  const id = parseInt(item_id);
  if (Number.isNaN(id)) {
    throw new Error(`Tried to remove a list item but item_id is not a number: ${item_id}`);
  }
  return id;
}

export async function updateListButtons(query_id: string, query_message: Message | undefined, bot: TelegramBot): Promise<void> {
  if (query_message === undefined) {
    throw new Error('Tried to update the list-buttons but "query.query_message" is undefined.');
  }
  const buttons = await listItemButtons(query_message.chat.id);
  telegram.changeMessage(i18n.message_text, buttons, query_id, query_message, bot);
}

async function listItemButtons(chat_id: number): Promise<InlineKeyboard> {
  const list_items = await db.getAllItemsForChat(chat_id);
  const button_items = list_items.map(toButton);
  const buttons = telegram.buttons(button_items);
  return buttons;
}

function toButton(item: ListItem) {
  let text = item.text;
  if (item.checked === BOOL.TRUE) {
    text = '✅ ' + item.text;
  }
  return {
    id: item.id.toString(),
    text,
  };
}