const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    description: String,
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

// compound index
listSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("list", listSchema);
