import * as dotenv from 'dotenv'
import path from 'path';
dotenv.config({path: path.join(__dirname, '..', '.env')});

export const bot_token = process.env.BOT_TOKEN