const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  name: String,
  size: Number,
  path: String,
  mime_type: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  terminated_at: { type: Date, default: null },
});

mongoose.model("Files", schema);
