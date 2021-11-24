const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
  user_id: { type: ObjectId, ref: "Users" },
  team_id: { type: ObjectId, ref: "Teams" },
  project_id: { type: ObjectId, ref: "Projects" },
  role_id: { type: ObjectId, ref: "Roles" },
  cmd: { type: String, default: "CRUD" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  terminated_at: { type: Date, default: null },
});

mongoose.model("Permissions", schema);
