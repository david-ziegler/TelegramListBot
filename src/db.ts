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

  // public async rsvpToEvent(event_id: number, user_id: number, name: string): Promise<void> {
  //   await run(this.db, 'INSERT INTO attendees (event_id, user_id, name) VALUES (?, ?, ?)', [event_id, user_id, sanitized_full_name]);
  // }

  // public async didThisUserRsvpAlready(chat_id: number, message_id: number, user_id: number): Promise<boolean> {
  //   const attendances = await this.getAttendeesForEventAndUser(chat_id, message_id, user_id);
  //   return attendances.length > 0;
  // }

  // private async getAttendeesForEventAndUser(chat_id: number, message_id: number, user_id: number): Promise<Attendee[]> {
  //   return await all<Attendee>(this.db, 'SELECT * FROM attendees JOIN events ON attendees.event_id = events.id WHERE chat_id=? AND message_id=? AND user_id=?',
  //     [chat_id, message_id, user_id],
  //   );
  // }

  // public async getAttendeesForEvent(chat_id: number, message_id: number): Promise<Attendee[]> {
  //   return await all<Attendee>(this.db, 'SELECT * FROM attendees JOIN events ON attendees.event_id = events.id WHERE chat_id=? AND message_id=?',
  //     [chat_id, message_id],
  //   );
  // }
}
