import { Database } from 'sqlite3';
import { ListItem } from '../models';
import { all, run } from './db-helpers';
import { ENV } from './environment-variables';

export class DB {
  private db: Database;

  constructor() {
    this.db = new Database(ENV.DATABASE_PATH);
    console.log(`Initialized DB ${ENV.DATABASE_PATH}`);
  }

  public async getAllItemsForChat(chat_id: number): Promise<ListItem[]> {
    return await all<ListItem>(this.db, 'SELECT * FROM list_items WHERE chat_id=?', [chat_id]);
  }

  public async insertListItems(chat_id: number, item_texts: string[]): Promise<void> {
    await Promise.all(item_texts.map(async (item_text: string) => {
      await run(this.db, 'INSERT INTO list_items (chat_id, text) VALUES (?,?)', [chat_id, item_text]);
    }));
  }

  public async removeListItem(id: number): Promise<void> {
    await run(this.db, 'DELETE FROM list_items WHERE id=?', [id]);
  }
}
