const mongoose = require("mongoose");
require("mongoose-double")(mongoose);
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const SchemaTypes = Schema.Types;

const schema = new Schema({
  sequence_code: Number,
  title: String,
  description: String,
  order: SchemaTypes.Double,
  assigns: [{ type: ObjectId, ref: "Users" }],
  subtasks: [
    {
      sequence_code: String,
      title: String,
      description: String,
      started_at: Date,
      finished_at: Date,
      created_by: { type: ObjectId, ref: "Users" },
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: null },
      terminated_at: { type: Date, default: null },
    },
  ],
  discussions: [
    {
      messages: String,
      files: [{ type: ObjectId, ref: "Files" }],
      created_by: { type: ObjectId, ref: "Users" },
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: null },
      terminated_at: { type: Date, default: null },
    },
  ],
  started_at: Date,
  finished_at: Date,
  created_by: { type: ObjectId, ref: "Users" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  terminated_at: { type: Date, default: null },
});

mongoose.model("Tasks", schema);
