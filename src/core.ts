export function extractListItemTexts(text: string): string[] {
  const new_items_text = removeBotCommand(text);
  if (new_items_text === '') {
    return [];
  }
  const new_items = new_items_text.split(/\n/);
  const items_trimmed = new_items.map(item => item.trim());
  return items_trimmed;
}

export function removeBotCommand(text: string): string {
  return text.replace(/^\/(L|l)ist(e)?/, '');
}
