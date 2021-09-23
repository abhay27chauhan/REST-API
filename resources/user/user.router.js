const { Router }= require("express");
const {me, updateMe} = require("./user.controllers")

const userRouter = Router();

// /api/user/
userRouter
.route('/')
.get(me)
.put(updateMe)


module.exports = userRouter;