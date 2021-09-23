const { Router } = require("express");
const controllers = require('./list.controllers')

const listRouter = Router();

// /api/list
listRouter
.route('/')
.get()
.post()

// /api/list/:id
listRouter
.route('/:id')
.get()
.put()
.delete()

module.exports = listRouter;