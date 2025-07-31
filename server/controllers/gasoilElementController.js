const db = require("../../models");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sendRes = require("../utils/sendRes");
const reqHandler = require("./reqHandler");

exports.getAllGasoilElement = reqHandler.Find(db.GasoilElement,[],false);
exports.getOneGasoilElement = reqHandler.FindOne(db.GasoilElement);


exports.updateGasoilElement = reqHandler.UpdateOne(
  db.GasoilElement,
  db.GasoilElementHistory,
  "GasoilElementId"
);
exports.addGasoilElement = reqHandler.Create(db.GasoilElement);


exports.deleteGasoilElement = catchAsync(async (req, res, next) => {
  // Find the document
  const doc = await db.GasoilElement.findOne({ where: { id: req.params.id } });

  if (!doc) {
    return next(new AppError(`This document doesn't exist`, 404)); // If the document is not found
  }

  // Document found, retrieve the associated GasoilSortieId
  const id = doc.GasoilSortieId;

  // Delete the document
  await doc.destroy();

  // Prepare the history log object
  const obj = {
    data: "deletedAt",
    prevVal: null,
    newVal: "has been deleted",
    ['GasoilElementId']: req.params.id,  // Ensure 'nameId' is defined earlier in your code
    UserId: req.user.id,
  };

  // Create history log if the value has changed
  if (obj.prevVal !== obj.newVal) {
    await db.GasoilElementHistory.create(obj);
  }

  // Update the GasoilSortie total price
  const GasoilSortie = await db.GasoilSortie.findOne({
    where: { id },
  });

  if (GasoilSortie) {
    const total = await db.GasoilElement.findAll({
      where: { GasoilSortieId: id },
      attributes: [[db.sequelize.literal("SUM(price * quantity)"), "result"]],
      raw: true,
    });

    GasoilSortie.total_price = total[0].result || 0;
    await GasoilSortie.save();
  }

  // Send response back to the client
  res.status(200).json({
    status: 'success',
    message: 'Gasoil element has been deleted and GasoilSortie updated successfully.',
  });
});
