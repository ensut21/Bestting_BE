const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const { randomSixDigit } = require('../../utils/common')

const schema = new Schema({
  code: String,
  name: String,
  members: [{
    user_id: { type: ObjectId, ref: "Users" },
    role: String,
    permission_cmd: String,
    projects: [{ type: ObjectId, ref: "Projects" }]
  }],
  projects: [{ type: ObjectId, ref: "Projects" }],
  created_by: { type: ObjectId, ref: "Users" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  terminated_at: { type: Date, default: null },
});

schema.pre('save', function(next) {
  this.code = `#${randomSixDigit()}`;
  // do stuff
  next();
});

mongoose.model("Teams", schema);
