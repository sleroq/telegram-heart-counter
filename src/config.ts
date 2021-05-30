import * as dotenv from 'dotenv'
import path from 'path';
dotenv.config({path: path.join(__dirname, '..', '.env')});

export const bot_token = process.env.BOT_TOKEN
export const heroku_url = process.env.HEROKU_URL
export const PORT = process.env.PORT