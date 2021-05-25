import { db, update_db } from '../records/records_handler'
import {edit_count_message} from '../functions/edit_count_message'

export async function cb_query_handler(ctx:any) {
    const query_data = ctx.update.callback_query.data;
    const chat_id:number = ctx.chat.id
    // if (ctx.update.callback_query && ctx.update.callback_query.date) {
    //     return
    //   }
    ctx.answerCbQuery().catch((err:any) => {
        console.log(err);
    });

    let back_to_count_button = [[{ text: " <- back", callback_data: "count" }]]

    if (query_data.match(/show_\d+/)) {
        const index = query_data.spit('_')[1]
        const counter = db[chat_id].counters[index]

        const counter_message = 'Count of ' + counter.heart + " - " + counter.overall +
            "\nTop users:\nnot implemented"

        ctx.editMessageText(counter_message, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: back_to_count_button
            }
        })
        return
    }
    if (query_data === "new_counter") {
        // console.log(ctx.update)
        // console.log(ctx.update.callback_query.message)
        db[ctx.chat.id].counters.push({ "overall": ctx.update.callback_query.message.message_id, users:{} })
        await update_db(db)

        const creating_counter_message = "Reply to this message with symbols you want to count."
        ctx.editMessageText(creating_counter_message, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: back_to_count_button
            }
        })
    }
    if (query_data === "count") {
        edit_count_message(ctx, ctx.update.message.message_id, db)
    }
}
