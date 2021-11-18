const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  messages: String,
  files: [{ type: ObjectId, ref: "Files" }],
  created_by: { type: ObjectId, ref: "Users" },
  reply_to: { type: ObjectId, ref: "Chats" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  terminated_at: { type: Date, default: null },
});

mongoose.model("Chats", schema);
