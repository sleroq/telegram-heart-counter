import { records } from "records";
import { Context } from "telegraf";
import { escape_markdown } from './escape_markdown'

export function edit_count_message(ctx: Context, edit_message_id: number, db: records) {
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
            if (!counters[0].heart) {
                let button_text = element.heart + " - " + element.overall
                keyboard.unshift([{ text: button_text, callback_data: "show_" + index }])
            }
        });
    } else {
        counters_message = 'Count of ' + counters[0].heart + "\n" + counters[0].overall +
            "\nTop users:\nnot implemented"
    }

    ctx.telegram.editMessageText(
        ctx.chat.id,
        edit_message_id,
        edit_message_id.toString(),
        escape_markdown(counters_message),
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