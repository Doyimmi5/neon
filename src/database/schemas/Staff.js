const { Schema, model } = require("mongoose");

const StaffSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  addedBy: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  permissions: {
    type: [String],
    default: ["BASIC_STAFF"],
  },
});

module.exports = model("Staff", StaffSchema);