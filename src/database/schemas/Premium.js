const { Schema, model } = require("mongoose");

const PremiumSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    default: null,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  redeemedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Premium", PremiumSchema);