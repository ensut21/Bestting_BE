const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  prefix: String,
  type: String,
  value: Schema.Types.Mixed, 
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  terminated_at: { type: Date, default: null },
});

mongoose.model("Configs", schema);
