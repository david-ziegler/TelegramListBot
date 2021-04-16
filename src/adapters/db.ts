import { Database } from 'sqlite3';
import { ListItem } from '../models';
import { all, run } from './db-helpers';
import { ENV } from './environment-variables';

export enum BOOL {
  TRUE = 'TRUE',
  FALSE = 'FALSE',
}

export class DB {
  private db: Database;

  constructor() {
    this.db = new Database(ENV.DATABASE_PATH);
    console.log(`Initialized DB ${ENV.DATABASE_PATH}`);
  }

  public async getAllItemsForChat(chat_id: number): Promise<ListItem[]> {
    return await all<ListItem>(this.db, 'SELECT * FROM list_items WHERE chat_id=?', [chat_id]);
  }

  public async getCheckedItemsForChat(chat_id: number): Promise<ListItem[]> {
    return await all<ListItem>(this.db, `SELECT * FROM list_items WHERE chat_id=? AND checked="${BOOL.TRUE}"`, [chat_id]);
  }

  public async insertListItems(chat_id: number, item_texts: string[]): Promise<void> {
    await Promise.all(item_texts.map(async (item_text: string) => {
      await run(this.db, `INSERT INTO list_items (chat_id, text, checked) VALUES (?,?, "${BOOL.FALSE}")`, [chat_id, item_text]);
    }));
  }

  public async checkListItem(id: number): Promise<void> {
    await run(this.db, `UPDATE list_items SET checked = "${BOOL.TRUE}" WHERE id=?`, [id]);
  }

  public async removeListItem(id: number): Promise<void> {
    await run(this.db, 'DELETE FROM list_items WHERE id=?', [id]);
  }
}
