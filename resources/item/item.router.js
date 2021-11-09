const { Router } = require("express");
const controllers = require('./item.controllers')

const itemRouter = Router();

itemRouter
.route('/')
.get(controllers.getMany)
.post(controllers.createOne)

itemRouter
.route('/:id')
.get(controllers.getOne)
.put(controllers.updateOne)
.delete(controllers.removeOne)

module.exports = itemRouter;