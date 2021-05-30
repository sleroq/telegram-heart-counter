import { db, update_db } from '../records/records_handler'
import { edit_count_message } from '../functions/edit_count_message'
import { escape_markdown } from '../functions/escape_markdown'

import { show_details } from './show_details'

export async function cb_query_handler(ctx: any) {
    const query_data = ctx.update.callback_query.data;
    const chat_id = ctx.chat.id

    if (!db[chat_id]) {
        return
    }
    ctx.answerCbQuery().catch((err: any) => {
        console.log(err);
    });

    let back_to_count_button = [[{ text: " <- back", callback_data: "count" }]]

    if (query_data.match(/^show_\d+/)) {
        show_details(ctx)
        return
    }
    if (query_data === "count") {
        edit_count_message(ctx, ctx.update.callback_query.message.message_id, db)
        return
    }
    if (query_data.match(/^askdel_\d+/)) {
        const index = query_data.split('_')[1]
        if (!db[chat_id].counters[index]) { return }
        const are_u_sure = "Are you sure you want to *delete* " + db[chat_id].counters[index].heart + " counter?"
        ctx.editMessageText(
            escape_markdown(are_u_sure), {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: [[{ text: "Yes", callback_data: "del_" + index }, { text: "No", callback_data: "show_" + index }]]
            }
        }).catch((err: any) => console.log(err))
        return
    }
    if (query_data.match(/^del_\d+/)) {
        const index = query_data.split('_')[1]
        if (!db[chat_id].counters[index]) { return }
        db[chat_id].counters.splice(index, 1)
        await update_db(db)
        await edit_count_message(ctx, ctx.update.callback_query.message.message_id, db)
        return
    }
    if (query_data === "new_counter") {
        const message_id = ctx.update.callback_query.message.message_id;
        const newest_counter_id = db[ctx.chat.id].counters.length
        db[ctx.chat.id].counters.push({ "overall": message_id, users: {} })
        await update_db(db)

        const creating_counter_message = "Reply to this message with symbols you want to count."
        ctx.editMessageText(
            escape_markdown(creating_counter_message), {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: [[{ text: " <- back", callback_data: "del_" + newest_counter_id }]]
            }
        }).catch((err: any) => console.log(err))
    }
}
