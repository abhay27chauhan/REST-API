const User = require("../resources/user/user.model");
const Token = require("../resources/token/token.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const secrets = {
  jwt: "myjsonsecret",
  jwtExp: "100d",
};

const newToken = (user) => {
  return jwt.sign({ id: user.id }, secrets.jwt, {
    expiresIn: secrets.jwtExp,
  });
};

const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secrets.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

const signup = async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.confirmPassword) {
    return res.status(400).send({ message: "need email and password" });
  }

  try {
    const user = await User.create(req.body);
    const token = newToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    return res.status(500).send(e);
  }
};

const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "need email and password" });
  }

  const invalid = { message: "Invalid email and passoword combination" };

  try {
    const user = await User.findOne({ email: req.body.email })
      .select("email password")
      .exec();

    if (!user) {
      return res.status(401).send(invalid);
    }

    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(401).send(invalid);
    }

    const token = newToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

const requestForgetPassword = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({ message: "need email" });
  }

  try {
    const user = await User.findOne({ email: req.body.email }).exec();

    if (!user) {
      return res.status(401).send("user doesn't exits!");
    }

    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    let resetToken = crypto.randomBytes(32).toString("hex");

    await Token.create({
      userId: user._id,
      token: resetToken,
      createdAt: Date.now(),
    });

    const link = `${clientURL}/forgetPassword?token=${resetToken}&id=${user._id}`;

    sendEmail(user.email, "Forget Password Request", {
      name: user.name,
      link: link,
    });

    return res.status(200).send(link);
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

const forgetPassword = () => {}

const isAuthorized = (roles) => {
  return function(req, res, next){
    const userRole = req.user.role;
    console.log(userRole);
    const authorizationStatus = roles.includes(userRole);
    if(authorizationStatus){
      next();
    }else{
      return res.status(401).send("User does not have required authorization");
    }
  }
}

const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).end();
  }

  const token = bearer.split("Bearer ")[1].trim();
  let payload;
  try {
    payload = await verifyToken(token);
  } catch (e) {
    return res.status(401).end();
  }

  const user = await User.findById(payload.id)
    .select("-password")
    .lean()
    .exec();

  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
};

module.exports = {
  signup,
  signin,
  protect,
  isAuthorized,
  requestForgetPassword,
  forgetPassword
};
