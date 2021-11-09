const { Router } = require("express");
const controllers = require('./list.controllers')

const listRouter = Router();

// /api/list
listRouter
.route('/')
.get(controllers.getMany)
.post(controllers.createOne)

// /api/list/:id
listRouter
.route('/:id')
.get(controllers.getOne)
.put(controllers.updateOne)
.delete(controllers.removeOne)

module.exports = listRouter;