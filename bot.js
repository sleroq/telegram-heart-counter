require('dotenv').config();
const config = require('./config.json');
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

//webhook
let webhook = true;
if (process.env.ON_HEROKU) {
  bot.telegram.setWebhook(process.env.HEROKU_URL);
} else if (process.env.ON_GLITCH) {
  console.log(process.env.GLITCH_URL);
  bot.telegram.setWebhook(process.env.GLITCH_URL);
} else {
  webhook = false;
}
const express = require('express');
const expressApp = express();
if (webhook) {
  expressApp.use(bot.webhookCallback('/secret-path'));
}
//testing mongoose
let mongoosePort = process.env.MONGO_PORT;
require('mongoose')
  .connect('mongodb://localhost/karri', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .catch((e) => console.log(e));
const User = require('./models/User.model');
const Heart = require('./models/Heart.model');

let botSettings;
bot.telegram.getMe().then(async (getMe) => {
  botSettings = await User.findById(getMe.id);
  if (!botSettings) {
    botSettings = new User({
      _id: getMe.id,
      username: getMe.username,
      first_name: getMe.first_name,
    });
    botSettings.save();
  }
});


//commands
const { text_handler } = require('./modules/text_handler.js');
bot.start(async (ctx) => {
  let user = await User.findById(getMe.id);
  if (!user) {
    user = new User({
      _id: getMe.id,
      username: getMe.username,
      first_name: getMe.first_name,
    });
    user.save();
  }
  let randIndex = Math.floor(
    Math.random() * Math.floor(randIndex.greetings.length)
  );
  await ctx.reply(config.greetings[randIndex]);
});
bot.on('channel_post', async (ctx) => {
  await text_handler(ctx);
});
bot.on('message', async (ctx) => {
  await text_handler(ctx);
});

expressApp.get('/users', (req, res) => {
  User.find({}).exec((err, users) => {
    if (err) {
      res.send('error has occured', req);
      console.log(err);
      return;
    }
    console.log(users);
    res.send(users);
  });
});

expressApp.get('/hearts', (req, res) => {
  Heart.find({}).exec((err, hearts) => {
    if (err) {
      res.send('error has occured', req);
      console.log(err);
      return;
    }
    // console.log(hearts);
    res.send(hearts);
  });
});
//express
expressApp.listen(mongoosePort, () => {
  console.log(`Mongoose is running on port ${mongoosePort}`);
});
if (webhook) {
  const PORT = process.env.PORT || 3000;
  expressApp.get('/', (req, res) => {
    res.send('Hello, love <3');
  });
  expressApp.listen(PORT, () => {
    console.log(`Bot is running on port ${PORT}`);
  });
} else {
  bot.telegram.deleteWebhook().then(() => {
    bot.launch();
  });
}
