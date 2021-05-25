import { bot_token, } from './config'
import { Telegraf } from 'telegraf'

import { db, update_db } from './records/records_handler'

import { cb_query_handler } from './buttons/index'
import { count_command } from './commands/count'
import { edit_count_message } from './functions/edit_count_message'
import { counter } from 'records'

const bot = new Telegraf(bot_token);

bot.start((ctx) => ctx.reply('Hello to you!'))

bot.command("count", async (ctx) => await count_command(ctx))

bot.on("callback_query", async (ctx) => await cb_query_handler(ctx))

bot.on("text", async ctx => {
    const message_of_bot = ctx.message.reply_to_message;
    const newest_counter = db[ctx.chat.id].counters[db[ctx.chat.id].counters.length - 1]
    if (("reply_to_message" in ctx.message) && (message_of_bot.message_id === newest_counter.overall)) {
        newest_counter.heart = ctx.message.text;
        newest_counter.overall = 0;
        await update_db(db)
        edit_count_message(ctx, message_of_bot.message_id, db)
        return
    }

    const counters = db[ctx.chat.id].counters
    for (let i = 0; i < counters.length; i++) {
        let heart = new RegExp(counters[i].heart)
        if (counters[i].heart && ctx.message.text.match(heart)) {
            const occurrences = ctx.message.text.match(heart).length
            counters[i].overall += occurrences
            if (!counters[i].users[ctx.from.id]) {
                counters[i].users[ctx.from.id] = {
                    count: 0
                }
            }
            counters[i].users[ctx.from.id].count += occurrences
            update_db(db)
        }
    }
})



start_bot_with_polling(bot)

async function start_bot_with_polling(bot: any) {
    // bot.polling.offset = await clearOldMessages(bot)
    await bot.launch()
    console.log("Bot is started polling!")
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