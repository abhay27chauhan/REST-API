const User = require("./user.model");

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

module.exports = {
    me, updateMe
}

// ._id -> objectId -> always safe -> mainly when 2 schema are involved
// .id -> virtualization -> field that doesn't exist in database and gets created at runtime -> safe to use when 1 schema is involved