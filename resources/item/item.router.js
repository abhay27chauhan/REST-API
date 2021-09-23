const { Router } = require("express");
const controllers = require('./item.controllers')

const itemRouter = Router();

itemRouter
.route('/')
.get()
.post()

itemRouter
.route('/:id')
.get()
.put()
.delete()

module.exports = itemRouter;