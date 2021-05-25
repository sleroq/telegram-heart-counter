import { db } from '../records/records_handler'
import { escape_markdown } from '../functions/escape_markdown'

let back_to_count_button = [[{ text: " <- back", callback_data: "count" }]]

export function show_details(ctx:any){
    const query_data = ctx.update.callback_query.data;
    const chat_id = ctx.chat.id

    const index = query_data.split('_')[1]
    const counter = db[chat_id].counters[index]

    const counter_message = 'Count of ' + counter.heart + " - " + counter.overall +
        "\nTop users:\nnot implemented"
    back_to_count_button[0].unshift({ text: "delete", callback_data: "del_" + index})
    ctx.editMessageText(
        escape_markdown(counter_message), {
        parse_mode: "MarkdownV2",
        reply_markup: {
            inline_keyboard: back_to_count_button
        }
    }).catch((err:any)=>console.log(err))
}