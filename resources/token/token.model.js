const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: true,
  },
  token: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // this is the expiry time in seconds -> 1 hour
  },
});

tokenSchema.pre("save", function (next) {
  if (!this.isModified("token")) {
    return next();
  }

  bcrypt.hash(this.token, 8, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.token = hash;
    next();
  });
});

tokenSchema.methods.checkToken = function (token) {
  const tokenHash = this.token;
  return new Promise((resolve, reject) => {
    bcrypt.compare(token, tokenHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same); // true or false
    });
  });
};

module.exports = mongoose.model("token", tokenSchema);