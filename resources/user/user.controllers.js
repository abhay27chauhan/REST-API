const User = require("./user.model");
const {
  requestPasswordReset,
  resetPassword,
} = require("../../utils/passwordReset");

const me = (req, res) => {
  res.status(200).json({ data: req.user });
};

const updateMe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    })
      .lean()
      .exec();

    res.status(200).json({ data: user });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

const getMatchedUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean().exec();
    if(!user){
      return res.status(400).end()
    }
    res.status(200).json({data: user});
  } catch (e) {
    console.log(e);
    res.status(500).json({error: e.message});
  }
};

const updateMacthedUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();
    
    if (!user) {
      return res.status(400).end()
    }

    res.status(200).json({ data: user });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

const deleteMatchedUser = async (req, res) => {
  try {
    const removed = await User.findByIdAndDelete(req.params.id)

    if (!removed) {
      return res.status(400).end()
    }

    return res.status(200).json({ data: removed })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

const resetPasswordRequestController = async (req, res) => {
  try {
    const requestPasswordResetService = await requestPasswordReset(req.user);
    return res.status(200).json(requestPasswordResetService);
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const resetPasswordService = await resetPassword(
      req.user,
      req.body.token,
      req.body.password,
      req.body.confimPassword
    );
    return res.status(200).json(resetPasswordService);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};

module.exports = {
  me,
  updateMe,
  getMatchedUser,
  updateMacthedUser,
  deleteMatchedUser,
  resetPasswordRequestController,
  resetPasswordController,
};

// ._id -> objectId -> always safe -> mainly when 2 schema are involved
// .id -> virtualization -> field that doesn't exist in database and gets created at runtime -> safe to use when 1 schema is involved
