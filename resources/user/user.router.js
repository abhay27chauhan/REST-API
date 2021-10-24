const { Router } = require("express");
const { isAuthorized } =require("../../utils/auth");
const {
  me,
  updateMe,
  getMatchedUser,
  updateMacthedUser,
  deleteMatchedUser,
  resetPasswordRequestController,
  resetPasswordController,
} = require("./user.controllers");

const userRouter = Router();

// /api/user/
userRouter.route("/")
.get(isAuthorized(["admin", "user"]), me)
.put(isAuthorized(["admin", "user"]),updateMe);

userRouter.route("/:id")
.get(isAuthorized(["admin"]), getMatchedUser)
.put(isAuthorized(["admin"]), updateMacthedUser)
.delete(isAuthorized(["admin"]), deleteMatchedUser);

userRouter.route("/requestResetPassword").get(resetPasswordRequestController);

userRouter.route("/resetPassword").post(resetPasswordController);

module.exports = userRouter;