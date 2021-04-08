import { Database } from 'sqlite3';
import { ListItem } from './models';
import { all, run } from './stuff/db-helper';
import { ENV } from './stuff/environment-variables';

export class DB {
  private db: Database;

  constructor() {
    this.db = new Database(ENV.DATABASE_PATH);
    console.log(`Initialized DB ${ENV.DATABASE_PATH}`);
  }

  public async getAllItemsForChat(chat_id: number): Promise<ListItem[]> {
    return await all<ListItem>(this.db, 'SELECT * FROM list_items WHERE chat_id=?', [chat_id]);
  }

  public async insertListItem(chat_id: number, text: string): Promise<void> {
    await run(this.db, 'INSERT INTO list_items (chat_id, text) VALUES (?,?)', [chat_id, text]);
  }

  public async removeListItem(id: number): Promise<void> {
    await run(this.db, 'DELETE FROM list_items WHERE id=?', [id]);
  }
}
