const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "complete", "pastdue"],
      default: "active",
    },
    notes: String,
    due: Date,
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    list: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "list",
      required: true,
    },
  },
  { timestamps: true }
);

// compound index
itemSchema.index({ list: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("item", itemSchema);
