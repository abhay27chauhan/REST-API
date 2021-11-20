const getOne = model => async (req, res) => {
  try {
    const doc = await model
      .findOne({ createdBy: req.user._id, _id: req.params.id })
      .lean()
      .exec()

    if (!doc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

const getMany = model => async (req, res) => {
  try {
    const docs = await model
      .find({ createdBy: req.user._id })
      .lean()
      .exec()

    if (!docs) {
        return res.status(400).end()
    }

    res.status(200).json({ data: docs })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

function getManyAdvance(model) {
  return async function (req, res) {
      try {
          let requestPromise;

          // query
          if (req.query.myQuery) {
              requestPromise = model.find(req.query.myQuery);
          } else {
              requestPromise = model.find();
          }

          // sort
          if (req.query.sort) {
              requestPromise = requestPromise.sort(req.query.sort)
          }

          // select
          if (req.query.select) {
              let params = req.query.select.split("%").join(" ");
           requestPromise = requestPromise.select(params);
          }
          
          // paginate 
          let page = Number(req.query.page) || 1;
          let limit = Number(req.query.limit) || 4;
          let toSkip = (page - 1) * limit;
          requestPromise = requestPromise
              .skip(toSkip)
              .limit(limit);
          let elements = await requestPromise;
          res.status(200).json({
              data: elements
          })
      } catch (err) {
          res.status(502).json({
              message: err.message
          })
      }
  }
}

const createOne = model => async (req, res) => {
  const createdBy = req.user._id
  try {
    const doc = await model.create({ ...req.body, createdBy })
    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

const updateOne = model => async (req, res) => {
  try {
    const updatedDoc = await model
      .findOneAndUpdate(
        {
          createdBy: req.user._id,
          _id: req.params.id
        },
        req.body,
        { new: true }
      )
      .lean()
      .exec()

    if (!updatedDoc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: updatedDoc })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

const removeOne = model => async (req, res) => {
  try {
    const removed = await model.findOneAndRemove({
      createdBy: req.user._id,
      _id: req.params.id
    })

    if (!removed) {
      return res.status(400).end()
    }

    return res.status(200).json({ data: removed })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

module.exports =  crudControllers = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model)
})

// for creation
  // save
  // create

// for delete
 // findByIdAndDelete
 // findOneAndDelete

// for update
  // findByIdAndUpdate
 // findOneAndUpdate

// for read
  // find
  // findOne