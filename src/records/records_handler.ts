import * as databasee  from '../records/hearts.json';
import { count_of_user, counter, chat, records } from '../types/records'

import path from 'path';

import fs from 'fs';

export async function update_db(newdb: records) {
    const db_string = JSON.stringify(newdb)
    const filePath = path.join(__dirname, '..', 'records/hearts.json');
    fs.writeFile(filePath, db_string, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('File written successfully');
        }
    });
}

export const db: records = databasee


// async function saveChat(chat_id:Number) {
//     db[chat_id] = {[]}
// }