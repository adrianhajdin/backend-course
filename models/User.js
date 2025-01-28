const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subscription" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
