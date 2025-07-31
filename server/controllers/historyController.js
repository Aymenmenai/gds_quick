const db = require("../../models");
const catchAsync = require("../utils/catchAsync");
const sendRes = require("../utils/sendRes");

// ONLY TO MODIFY AND DELETE
exports.setHistory = (Model, data, element, nameId) => {
  // console.log(Model, data, element, nameId);
  catchAsync(async (req, res, next) => {
    // CURRENT OBJECT
    const DataBuilt = await Model.build({
      data,
      prevVal: element[data],
      newVal: req.body[data],
      [nameId]: element.id,
      UserId: req.user,
    });

    // console.log(DataBuilt);
    // return next();
  });
};

exports.getAllHistory = catchAsync(async (req, res, next) => {
  const historyModels = Object.keys(db).filter((modelName) =>
    modelName.includes("History")
  );
  const allResults = [];

  // Perform a request/query on each history model
  await Promise.all(
    historyModels.map(async (modelName) => {
      const Model = db[modelName];
      try {
        const results = await Model.findAll();
        results.forEach((result) => {
          allResults.push({
            modelName: modelName,
            result: result,
          });
        });
      } catch (error) {
        console.error(`Error querying ${modelName}:`, error);
      }
    })
  );

  // Sort allResults by createdAt attribute
  allResults.sort((a, b) => {
    return new Date(b.result.createdAt) - new Date(a.result.createdAt);
  });

  // Send response with sorted results
  res.status(200).json({ data: allResults });
});
