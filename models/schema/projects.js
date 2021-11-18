const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
  code: String,
  name: String,
  team_id: { type: ObjectId, ref: "Teams" },
  members: [{ type: ObjectId, ref: "Users" }],
  boards: [{ type: ObjectId, ref: "Boards" }],
  created_by: { type: ObjectId, ref: "Users" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  terminated_at: { type: Date, default: null },
});

mongoose.model("Projects", schema);
