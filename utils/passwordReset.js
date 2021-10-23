const User = require("../resources/user/user.model");
const Token = require("../resources/token/token.model");
const crypto = require("crypto");
const sendEmail = require("./sendEmail");
const bcrypt = require("bcryptjs");

const clientURL = "http://localhost:3000";

const requestPasswordReset = async (user) => {
  let token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  let resetToken = crypto.randomBytes(32).toString("hex");

  await Token.create({
    userId: user._id,
    token: resetToken,
    createdAt: Date.now(),
  });

  const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;

  sendEmail(user.email, "Password Reset Request", {
    name: user.name,
    link: link,
  });
  return link;
};

const resetPassword = async (user, token, password, confirmPassword) => {
  let passwordResetToken = await Token.findOne({ userId: user._id});

  if (!passwordResetToken) {
    throw new Error("Invalid or expired password reset token");
  }

  const isValid = await passwordResetToken.checkToken(token);

  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }

  user.resetHandler(password, confirmPassword);

  await user.save();
  const userUpdated = await User.findById({ _id: user._id });

  sendEmail(
    user.email,
    "Password Reset Successfully",
    {
      name: user.name,
    },
  );

  await passwordResetToken.deleteOne();

  return userUpdated;
};

module.exports = {
  requestPasswordReset,
  resetPassword
};
