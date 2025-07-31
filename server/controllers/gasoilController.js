const { Op } = require("sequelize");
const db = require("../../models");
const catchAsync = require("../utils/catchAsync");
const sendRes = require("../utils/sendRes");

const reqHandler = require("./reqHandler");

exports.getTheRestOfQuantity = catchAsync(async (req, res, next) => {
  // GET TOTAL GASOIL ENTREE QUANTITY
  // GET TOTAL GASOIL SORITE QUANTITY
});

exports.getYear = catchAsync(async (req, res, next) => {
  const currentYear = req.body.year || new Date().getFullYear();
  req.year = currentYear;
  next();
});

// COUNT ENTREE
exports.count = catchAsync(async (req, res, next) => {
  const startDate = new Date(req.year, 0, 1);
  const endDate = new Date(req.year, 11, 31);
  const Gasoil = await db.Gasoil.findOne({
    where: {
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [["createdAt", "DESC"]],
    attributes: ["number", "id", "createdAt"],
  });
  sendRes(res, 200, Gasoil?.number || 0);
});

// MAIN OPERATION
exports.addGasoil = async (req, res, next) => {
  try {
    const { date, number, facture, quantity, price, BeneficiareId } = req.body;
    const Gasoil = await db.Gasoil.create({
      date,
      number,
      quantity,
      price,
      facture,
      UserId: req.user.id,
      BeneficiareId,
    });
    await db.GasoilHistory.create({
      data: "createdAt",
      prevVal: null,
      newVal: null,
      GasoilId: Gasoil.id,
      UserId: req.user.id,
    });
    sendRes(res, 201, Gasoil.id);
  } catch (err) {
    console.log(err);
  }
};

// INCLUDE
const includeFile = [{ model: db.Beneficiare, attributes: ["name", "id"] }];

// REQUEST
exports.getAllGasoil = reqHandler.Find(
  db.Gasoil,
  includeFile,
  false
);
// exports.getOneGasoil = reqHandler.FindOne(db.Gasoil, includeFile);
exports.updateGasoil = reqHandler.UpdateOne(
  db.Gasoil,
  db.GasoilHistory,
  "GasoilId"
);

// DELETE ENTREE WITH ARTICLES
exports.deleteGasoil = catchAsync(async (req, res, next) => {
  // DELETE
  const doc = await db.Gasoil.destroy({ where: { id: req.params.id } });
  if (!doc) {
    return next(new AppError(`This document doesn't exist`, 404));
  }
  // DELETE ENTREE HISTORY
  let obj = {
    data: "deletedAt",
    prevVal: null,
    newVal: "has been deleted",
    GasoilId: req.params.id,
    UserId: req.user.id,
  };
  await db.GasoilHistory.create(obj);

  sendRes(res, 200, doc);
  return next();
});

const GasoilInclude = [
  { model: db.Beneficiare, attributes: ["id", "name"] },
];
exports.getOneGasoil = reqHandler.FindOne(
  db.Gasoil,
  GasoilInclude
);
