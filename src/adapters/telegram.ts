import TelegramBot, { SendMessageOptions } from 'node-telegram-bot-api';
import { InlineKeyboard } from 'node-telegram-keyboard-wrapper';

export async function sendMessage(chat_id: number, buttons: InlineKeyboard, message_text: string, bot: TelegramBot): Promise<void> {
  const options: SendMessageOptions = {
    parse_mode: 'MarkdownV2',
    reply_markup: buttons.length > 0 ? buttons.getMarkup() : undefined,
  };
  await bot.sendMessage(chat_id, message_text, options);
}
