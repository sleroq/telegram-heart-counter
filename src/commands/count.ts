import { db, update_db } from '../records/records_handler'
import { escape_markdown } from '../functions/escape_markdown'

import { Context } from "vm"

export async function count_command (ctx:Context) {
    const chat_id = ctx.chat.id.toString();

    if (!db[chat_id]) {
        db[chat_id] = {
            language_code: ctx.message.from.language_code,
            counters: []
        }
        update_db(db)
    }
    const counters = db[chat_id].counters
    let keyboard = [[{ text: "New counter", callback_data: "new_counter" }]]

    if (counters.length === 0 || (counters.length === 1 && !counters[0].heart)) {
        ctx.reply('You dont have any counters yet',
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
            if(!counters[0].heart){
            let button_text = element.heart + " - " + element.overall
            keyboard.unshift([{ text: button_text, callback_data: "show_" + index }])
            }
        });
    } else {
        counters_message = 'Count of ' + counters[0].heart + "\n" + counters[0].overall +
            "\nTop users:\nnot implemented"
    }
    ctx.reply(escape_markdown(counters_message),
        {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: keyboard
            }
        });
}