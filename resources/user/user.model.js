const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: function () {
        // third party library
        return validator.isEmail(this.email);
      },
    },
    password: {
      type: String,
      minLenght: [8, "Password must be of min 8 characters long"],
      required: [true, "Password is required"],
    },
    confirmPassword: {
      type: String,
      minlength: [8, "Confirm password must be of min 8 characters long"],
      required: [true, "Confirm password is required"],
      validate: function(){
        return this.confirmPassword === this.password
      }
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
      default: "user",
    },
    lists: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "list",
    },
    settings: {
      theme: {
        type: String,
        required: true,
        default: "dark",
      },
      notifications: {
        type: Boolean,
        required: true,
        default: true,
      },
      compactMode: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  },
  { timestamps: true }
);

// hook
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

userSchema.pre('save', function (next) {
  this.confirmPassword = undefined;
  next();
});

// document method
userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same); // true or false
    });
  });
};

userSchema.methods.resetHandler = function (password, confirmPassword) {
  this.password = password;
  this.confirmPassword = confirmPassword;
}

module.exports = mongoose.model("user", userSchema);
