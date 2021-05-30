import { records } from "records";
import { Context } from "telegraf";
import { escape_markdown } from './escape_markdown'
import { get_top_users } from "../functions/top_users_message"

export function edit_count_message(ctx: Context, edit_message_id: number, db: records) {
    if(!db[ctx.chat.id]){
        return
    }
    const counters = db[ctx.chat.id].counters
    let keyboard = [[{ text: "New counter", callback_data: "new_counter" }]]

    if (counters.length === 0 || (counters.length === 1 && !counters[0].heart)) {
        ctx.editMessageText('You dont have any counters yet',
            {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: keyboard
                }
            });
        return
    }
    let counters_message: string

    if (counters.length > 1) {
        counters_message = 'Counters:'
        counters.forEach((element, index) => {
            if (counters[0].heart) {
                let button_text = element.heart + " - " + element.overall
                keyboard.unshift([{ text: button_text, callback_data: "show_" + index }])
            }
        });
    } else {
        counters_message = 'Count of ' + counters[0].heart + " \\- " + counters[0].overall;
        const counter = db[ctx.chat.id].counters[0]
        if (Object.keys(counter.users).length !== 0) {
            counters_message = get_top_users(counters_message, counter)
        }
    }
    ctx.telegram.editMessageText(
        ctx.chat.id,
        edit_message_id,
        edit_message_id.toString(),
        counters_message,
        {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: keyboard
            }
        }
    ).catch(err => {
        if (err.response.error_code !== 400) { console.log(err.error_code) }
    })
    return
}