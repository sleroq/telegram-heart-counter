import { db } from '../records/records_handler'
import { get_top_users } from '../functions/top_users_message'

export function show_details(ctx: any) {
    const query_data = ctx.update.callback_query.data;
    const chat_id = ctx.chat.id
    const index = query_data.split('_')[1]

    if (!db[chat_id] || !db[chat_id].counters[index]) {
        return
    }
    const counter = db[chat_id].counters[index]

    let counter_message = 'Count of ' + counter.heart + " \\- `" + counter.overall + '`';
    if (Object.keys(counter.users).length !== 0) {
        counter_message = get_top_users(counter_message, counter)
    }

    ctx.editMessageText(
        counter_message, {
        parse_mode: "MarkdownV2",
        reply_markup: {
            inline_keyboard: [[{ text: "delete", callback_data: "askdel_" + index }, { text: " <- back", callback_data: "count" }]]
        }
    }).catch((err: any) => console.log(err))
}