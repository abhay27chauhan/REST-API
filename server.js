require('dotenv').config()
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { connect } = require("./utils/db");
const userRouter = require("./resources/user/user.router");
const itemRouter = require("./resources/item/item.router");
const listRouter = require("./resources/list/list.router");
const {signup, signin, protect, requestForgetPassword, forgetPassword } = require("./utils/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'));

app.post('/signup', signup);
app.post('/signin', signin);
app.post('/requestForgetPassword', requestForgetPassword);
app.post('/forgetPassword', forgetPassword);

app.use('/api', protect);
app.use('/api/user', userRouter);
app.use('/api/item', itemRouter);
app.use('/api/list', listRouter);

const PORT = '5000';
const start = async () => {
    try {
        await connect()
        app.listen(PORT, () => {
            console.log(`REST API on http://localhost:${PORT}/api`)
        })
    } catch (e) {
        console.error(e)
    }
}

module.exports = {
    start
}