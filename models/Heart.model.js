const { Schema, model } = require("mongoose");

const heart = new Schema({
  chat_id: String,
  sender_id: String,
  sender_username: String,
  type: String,
  message: {},
  from: {},
  date: { type: Date, default: Date.now },
});

module.exports = model("Heart", heart);
