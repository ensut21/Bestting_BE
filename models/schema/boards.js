const mongoose = require("mongoose");
require('mongoose-double')(mongoose);
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const SchemaTypes = Schema.Types;

const schema = new Schema({
  name: String,
  code: String,
  status_list: [
    {
      name: String,
      color: String,
      order: SchemaTypes.Double,
      isDone: Boolean,
      created_by: { type: ObjectId, ref: "Users" },
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: null },
      terminated_at: { type: Date, default: null },
    },
  ],
  created_by: { type: ObjectId, ref: "Users" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  terminated_at: { type: Date, default: null },
});

mongoose.model("Boards", schema);
