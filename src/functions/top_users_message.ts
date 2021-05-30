import { counter, count_of_user } from "records";
import { escape_markdown } from "../functions/escape_markdown"

export function get_top_users(message: string, counter:counter) {
    message += "\n*Top users:*\n"
    // make array from object to be able to sort users

    let all_users: Array<count_of_user> = [];
    Object.keys(counter.users).forEach(element => {
        all_users.push(counter.users[element])
    })

    all_users.sort(function (a, b) {
        return b.count - a.count;
    });
    const users_keys = Object.keys(counter.users);

    const max_users_in_top = 5;
    const number_of_top_users = max_users_in_top > users_keys.length ? users_keys.length : max_users_in_top;

    for (let i = 0; i < number_of_top_users; i++) {
        let name_of_user: string
        if (all_users[i].username) {
            name_of_user = '@' + all_users[i].username
        } else if (all_users[i].first_name) {
            name_of_user = all_users[i].first_name
        } else {
            name_of_user = "Someone"
        }
        message += `${escape_markdown(name_of_user)}: \`${all_users[i].count}\`\n`
    }
    return message
}