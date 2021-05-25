import { records } from "records";
import { Context } from "telegraf";

export function edit_count_message(ctx: Context, edit_message_id: number, db: records) {
    const counters = db[ctx.chat.id].counters
    let keyboard = [[{ text: "New counter", callback_data: "new_counter" }]]

    if (counters.length === 0) {
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
            let button_text = element.heart + " - " + element.overall
            keyboard.unshift([{ text: button_text, callback_data: "show_" + index }])
        });
    } else {
        counters_message = 'Count of ' + counters[0].heart + "\n" + counters[0].overall +
            "\nTop users:\nnot implemented"
    }
    ctx.telegram.editMessageText(
        ctx.chat.id,
        edit_message_id,
        edit_message_id.toString(),
        counters_message,
        {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: keyboard
            }
        }
    )
    return
}