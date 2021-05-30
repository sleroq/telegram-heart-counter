import { bot_token, heroku_url, PORT } from './config'
import { Telegraf } from 'telegraf'

import express from "express";
const expressApp = express();

import { db, update_db } from './records/records_handler'

import { cb_query_handler } from './buttons/index'
import { count_command } from './commands/count'
import { edit_count_message } from './functions/edit_count_message'
import { escape_regexp } from './functions/escape_regexp'

const bot = new Telegraf(bot_token);

bot.start((ctx) => ctx.reply('Hello to you!'))

bot.command("count", async (ctx) => await count_command(ctx))

bot.on("callback_query", async (ctx) => await cb_query_handler(ctx))

bot.on("text", async ctx => {
    const chat_id = ctx.chat.id
    if (!db[chat_id]) {
        db[chat_id] = {
            language_code: ctx.message.from.language_code,
            counters: []
        }
        update_db(db)
    }
    if (db[chat_id].counters.length === 0) {
        return
    }
    const message_of_bot = ctx.message.reply_to_message;
    const newest_counter = db[chat_id].counters[db[chat_id].counters.length - 1]
    if (("reply_to_message" in ctx.message) && (message_of_bot.message_id === newest_counter.overall)) {
        newest_counter.heart = ctx.message.text;
        newest_counter.overall = 0;
        await update_db(db)
        edit_count_message(ctx, message_of_bot.message_id, db)
        return
    }

    const counters = db[chat_id].counters
    for (let i = 0; i < counters.length; i++) {
        if (!counters[i] || counters[i].heart == undefined) {
            return
        }
        let heart = new RegExp(
            escape_regexp(counters[i].heart), 'g'
        )
        if (counters[i].heart && ctx.message.text.match(heart)) {
            const occurrences = ctx.message.text.match(heart).length
            counters[i].overall += occurrences
            counters[i].last_occurrence = ctx.message.message_id
            if (!counters[i].users[ctx.from.id]) {
                counters[i].users[ctx.from.id] = {
                    count: 0
                }
                if (ctx.from.username) {
                    counters[i].users[ctx.from.id].username = ctx.from.username
                }
                if (ctx.from.first_name) {
                    counters[i].users[ctx.from.id].first_name = ctx.from.first_name
                }
                if (ctx.from.last_name) {
                    counters[i].users[ctx.from.id].last_name = ctx.from.last_name
                }
            }
            counters[i].users[ctx.from.id].count += occurrences
            update_db(db)
        }
    }
})


if (heroku_url) {
    start_bot_with_webhook(bot, +PORT) // with webhook
} else {
    start_bot_with_polling(bot) // with polling
}

async function start_bot_with_polling(bot: any) {
    if(bot.polling){bot.polling.offset = await clearOldMessages(bot)}
    await bot.launch()
    console.log("Bot is started polling!")
}

async function start_bot_with_webhook(bot: any, PORT:number) {
    if(bot.polling){bot.polling.offset = await clearOldMessages(bot)}
    const port = PORT || 3000;
    const url_for_webhook = heroku_url;

    const webhook_answer = await bot.telegram.setWebhook(url_for_webhook + "/secret-path")
    console.log('webhook set - ' + url_for_webhook + " " + webhook_answer)

    expressApp.use(bot.webhookCallback("/secret-path"));
    expressApp.get("/", (req:Request, res:any) => {
        res.send("Hello, love <3");
    });
    expressApp.listen(port, () => {
        console.log(`Bot is running on port ${port}`);
    });
}

async function clearOldMessages(tgBot: any) {
    // Delete webhook (with webhook you can't use getUpdates())
    await bot.telegram.deleteWebhook()
    console.log("webhook deleted")
    // Get updates for the bot
    const updates = await tgBot.telegram.getUpdates(0, 100, -1);

    // Add 1 to the ID of the last one, if there is one
    let newOffset = updates.length > 0
        ? updates[updates.length - 1].update_id + 1
        : 0
        ;
    console.log("new offset is " + newOffset);
    return newOffset
}
