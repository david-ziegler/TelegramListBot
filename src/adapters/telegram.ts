import TelegramBot, { EditMessageTextOptions, Message, SendMessageOptions } from 'node-telegram-bot-api';
import { InlineKeyboard, InlineKeyboardButton, Row } from 'node-telegram-keyboard-wrapper';
import { ListItem } from '../models';

export async function replaceMessage(
  chat_id: number,
  message_id: number,
  message_text: string,
  bot: TelegramBot,
  buttons?: InlineKeyboard,
): Promise<void> {
  const options: SendMessageOptions = {
    parse_mode: 'MarkdownV2',
    reply_markup: buttonMarkup(buttons),
  };
  await bot.sendMessage(chat_id, message_text, options);
  bot.deleteMessage(chat_id, message_id.toString());
}

function buttonMarkup(buttons?: InlineKeyboard) {
  if (buttons === undefined || buttons.length === 0) {
    return undefined;
  }
  return buttons.getMarkup();
}

export async function changeMessage(
  message_text: string,
  buttons: InlineKeyboard,
  query_id: string,
  message: Message,
  bot: TelegramBot,
): Promise<void> {
  bot.answerCallbackQuery(query_id, { text: '' }).then(async () => {
    const options: EditMessageTextOptions = {
      chat_id: message.chat.id,
      message_id: message.message_id,
      parse_mode: 'MarkdownV2',
      reply_markup: buttons.length > 0 ? buttons.getMarkup() : undefined,
    };
    bot.editMessageText(message_text, options);
  });
}

export async function buttons(items: ListItem[]): Promise<InlineKeyboard> {
  const buttons = new InlineKeyboard();
  items.forEach((item: ListItem) => {
    const row = new Row(new InlineKeyboardButton(item.text, 'callback_data', item.id.toString()));
    buttons.push(row);
  });
  return buttons;
}