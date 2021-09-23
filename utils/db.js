const mongoose = require("mongoose");
const dbUrl= 'mongodb://localhost:27017/api-design'

const connect = (url = dbUrl, opts = {}) => {
    return mongoose.connect(
      url,
      { ...opts, useNewUrlParser: true }
    )
}

module.exports = {
    connect
}