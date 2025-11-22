const Design = require("../models/Design");
const Backup_Design = require("../models/Design");

const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");

const addDesign = asyncWrapper(async (req, res) => {
  const design = await Design.create(req.body);
  res.status(201).json({ design });
});

const addBuckupDesign = asyncWrapper(async (req, res) => {
  const design = await Backup_Design.create(req.body);
  res.status(201).json({ design });
});

const updateDesignBoardCreated = asyncWrapper(async (req, res, next) => {
  const { id: designID } = req.params;

  const design = await Design.findOneAndUpdate({ id: designID }, req.body, {
    new: true,
    runValidators: true,
  });
  console.log(req.body);
  if (!design) {
    return next(createCustomError(`No task with id : ${designID}`, 404));
  }

  res.status(200).json({ design });
});

const updatePinCreated = asyncWrapper(async (req, res, next) => {
  const { id: designID, productID } = req.params;

  const design = await Design.findOneAndUpdate(
    { id: designID },
    {
      $set: { "products.$[product].shared": true },
    },
    {
      arrayFilters: [{ "product.id": productID }],
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!design) {
    return next(createCustomError(`No task with id : ${designID}`, 404));
  }

  res.status(200).json({ design });
});

const getPendingDesigns = asyncWrapper(async (req, res) => {
  const design = await Design.aggregate([
    { $match: { shared: false } },
    { $project: { _id: 0, id: 1 } },
  ]);
  res.status(201).json(design);
});

const getSingleDesign = asyncWrapper(async (req, res, next) => {
  const { id: designID } = req.params;
  const design = await Design.findOne({ id: designID });
  if (!design) {
    return next(createCustomError(`No task with id : ${designID}`, 404));
  }

  res.status(200).json({ design });
});

module.exports = {
  addDesign,
  addBuckupDesign,
  updateDesignBoardCreated,
  updatePinCreated,
  getPendingDesigns,
  getSingleDesign,
};
