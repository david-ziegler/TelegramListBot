# Create lists in Telegram groups (bot)

## How to add it to your group

1. Open the Telegram group in which you would like to enable lists.
2. Open group "Info" and click "Edit" to go to group settings.
3. Click on "Administrators" and "Add Admin"
4. Type "@create_lists_bot" in the search and click on "List".
5. Click on "Done" to add the bot to the group. It might ask whether you want to first add the bot as a member to the group and then promote it to admin. In that case click yes.

## How to create a list

- In the group, type "/list blabla" as a message and send it. This will create a list with "blabla" as the first item. To add more items, again type "/list blubb".
- Type "/list" to show the list.
- Click on a list-item to remove it.


If you first want to try out how to use the bot, you can simply start a private message with @create_lists_bot and create list there that only you will see.


## Contributing

### Local development

1. Clone this repository. 
2. In order to be able to send and receive message via Telegram you first need to create a bot: [Create a bot with botfather](https://core.telegram.org/bots#3-how-do-i-create-a-bot). There you get a token.
3. In the terminal, go to the app's folder with `cd TelegramListsBot`.
4. Create a database by running `yarn install`, `mkdir data` and `npx sqlite3 ./data/development.db`.
5. Create the database-tables by running the following three commands:
```
sqlite3 ./data/development.db
> CREATE TABLE list_items ("id" INTEGER NOT NULL UNIQUE,"chat_id" INTEGER NOT NULL,"text" TEXT NOT NULL, PRIMARY KEY("id" AUTOINCREMENT));
```

3. Rename the file `.env_example` to `.env` and set `DEV_BOT_TOKEN` to the token, you've got from BotFather. 
4. Then run `yarn watch`.

Now the bot is started in watch-mode, i.e. whenever you make changes to the code and save them, the bot automatically updates. You can now open Telegram (on the computer or phone) and use the bot (like in "How to create an list"). 

### Create your own bot with your changes

Follow the steps under "Local development"

You might find it useful to create two different bots, one for local development and one for production (for the outside world). In that case, create another bot with BotFather and paste the respective token into the `.env`-file under `PROD_BOT_TOKEN`.

For deployment I found [uberspace](https://uberspace.de/) really nice.

5eel free to send me a message if anything doesn't work.

### Used technology & acknowledgements

We use [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api), [node-telegram-keyboard-wrapper](https://github.com/alexandercerutti/node-telegram-keyboard-wrapper) and [sqlite3](https://github.com/mapbox/node-sqlite3).

You may find these documentations useful: [node-telegram-bot-api documentation](https://github.com/yagop/node-telegram-bot-api/blob/0b8ca03b54ac3361c2f656e2fa23c0e4423e49e5/doc/api.md), [Telegram API documentation](https://core.telegram.org/bots/api).
