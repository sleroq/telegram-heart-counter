const User = require('../models/User.model');
const Heart = require('../models/Heart.model');

// Heart.remove({}, function(err) {
//   console.log('collection removed')
// });
module.exports.text_handler = async function (ctx) {
  if (!ctx.update.channel_post || !ctx.update.channel_post.forward_from) {
    return;
  }
  let text = ctx.update.channel_post.text,
    channel_post = ctx.update.channel_post;
  let match = text.match(/\uD83D|\uD83E|\u2764|<З|<3/gim);
  if (!match) {
    return;
  }
  let matchJustHeart =
      text.match(/<З|<3/gim) != null ? text.match(/\u2764|<З|<3/gim) : [],
    matchRedHeart =
      text.match(/\u2764/gim) != null ? text.match(/\u2764/gim) : [],
    matchMotleyHeart =
      text.match(/\uD83D|\uD83E/gim) != null
        ? text.match(/\uD83D|\uD83E/gim)
        : [];

  for (let i = 0; i < matchJustHeart.length; i++) {
    let heart = new Heart({
      chat_id: channel_post.chat.id,
      sender_id: channel_post.forward_from.id,
      sender_username: channel_post.forward_from.username,
      type: matchJustHeart[i],
      message: channel_post,
    });
    heart.save();
  }
  for (let i = 0; i < matchRedHeart.length; i++) {
    let heart = new Heart({
      chat_id: channel_post.chat.id,
      sender_id: channel_post.forward_from.id,
      sender_username: channel_post.forward_from.username,
      type: 'red',
      message: channel_post,
    });
    heart.save();
  }
  for (let i = 0; i < matchMotleyHeart.length; i++) {
    let heart = new Heart({
      chat_id: channel_post.chat.id,
      sender_id: channel_post.forward_from.id,
      sender_username: channel_post.forward_from.username,
      type: 'multi-colored',
      message: channel_post,
    });
    heart.save();
  }
  let users = [713644079, 733677774, 607629302],
    usernames = ['karri_na', 'iamdowner', 'point'];
  let counterText = '*Counter:*\n';
  for (let t = 0; t < users.length; t++) {
    counterText += '`' + usernames[t] + '`:\n';
    let redHeart = await Heart.countDocuments({
      type: 'red',
      sender_id: users[t],
    });
    if (redHeart) {
      let LastredHeart = await Heart.findOne(
        { type: 'red', sender_id: users[t] },
        {},
        { sort: { created_at: -1 } }
      );
      counterText +=
        '❤️ : ' +
        redHeart +
        ' times' +
        '    [last](https://t.me/c/1228252892/' +
        LastredHeart.message.message_id +
        ')\n';
    }
    let lessThenZ = await Heart.countDocuments({
      type: new RegExp('<З'),
      sender_id: users[t],
    });
    if (lessThenZ) {
      let LastLessThenZ = await Heart.findOne(
        { type: new RegExp('<З'), sender_id: users[t] },
        {},
        { sort: { created_at: -1 } }
      );
      counterText +=
        '*<З* : ' +
        lessThenZ +
        ' times' +
        '    [last](https://t.me/c/1228252892/' +
        LastLessThenZ.message.message_id +
        ')\n';
    }
    let lessThenZsmall = await Heart.countDocuments({
      type: new RegExp('<з'),
      sender_id: users[t],
    });
    if (lessThenZsmall) {
      let LastLessThenZsmall = await Heart.findOne(
        { type: new RegExp('<з'), sender_id: users[t] },
        {},
        { sort: { created_at: -1 } }
      );
      counterText +=
        '*<з* : ' +
        lessThenZsmall +
        ' times' +
        '    [last](https://t.me/c/1228252892/' +
        LastLessThenZsmall.message.message_id +
        ')\n';
    }
    let lessThenThree = await Heart.countDocuments({
      type: new RegExp('<3'),
      sender_id: users[t],
    });
    if (lessThenThree) {
      let LastLessThenThree = await Heart.findOne(
        { type: new RegExp('<3'), sender_id: users[t] },
        {},
        { sort: { created_at: -1 } }
      );
      counterText +=
        '*<3* : ' +
        lessThenThree +
        ' times' +
        '    [last](https://t.me/c/1228252892/' +
        LastLessThenThree.message.message_id +
        ')\n';
    }
    let Motley = await Heart.countDocuments({
      type: 'multi-colored',
      sender_id: users[t],
    });
    if (Motley) {
      let LastMotley = await Heart.findOne(
        { type: 'multi-colored', sender_id: users[t] },
        {},
        { sort: { created_at: -1 } }
      );
      counterText +=
        '💙 : ' +
        Motley +
        ' times' +
        '    [last](https://t.me/c/1228252892/' +
        LastMotley.message.message_id +
        ')\n';
    }
  }
  await ctx.telegram
    .editMessageText(-1001228252892, 3, 3, counterText, {
      parse_mode: 'Markdown',
    })
    .catch((err) => console.log(err));
};
