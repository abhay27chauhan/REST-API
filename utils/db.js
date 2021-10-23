const mongoose = require("mongoose");
const dbUrl= process.env.DB_URL;

const connect = (url = dbUrl, opts = {}) => {
    return mongoose.connect(
      url,
      { ...opts, useNewUrlParser: true }
    )
}

module.exports = {
    connect
}