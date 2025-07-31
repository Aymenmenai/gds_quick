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
  const GasoilEntree = await db.GasoilEntree.findOne({
    where: {
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [["createdAt", "DESC"]],
    attributes: ["number", "id", "createdAt"],
  });
  sendRes(res, 200, GasoilEntree?.number || 0);
});

// MAIN OPERATION
exports.addGasoilEntree = async (req, res, next) => {
  try {
    const { date, number, facture, quantity, price, FournisseurId } = req.body;
    const GasoilEntree = await db.GasoilEntree.create({
      date,
      number,
      quantity,
      price,
      facture,
      UserId: req.user.id,
      FournisseurId,
    });
    await db.GasoilEntreeHistory.create({
      data: "createdAt",
      prevVal: null,
      newVal: null,
      GasoilEntreeId: GasoilEntree.id,
      UserId: req.user.id,
    });
    sendRes(res, 201, GasoilEntree.id);
  } catch (err) {
    console.log(err);
  }
};

// INCLUDE
const includeFile = [{ model: db.Fournisseur, attributes: ["name", "id"] }];

// REQUEST
exports.getAllGasoilEntree = reqHandler.Find(
  db.GasoilEntree,
  includeFile,
  false
);
// exports.getOneGasoilEntree = reqHandler.FindOne(db.GasoilEntree, includeFile);
exports.updateGasoilEntree = reqHandler.UpdateOne(
  db.GasoilEntree,
  db.GasoilEntreeHistory,
  "GasoilEntreeId"
);

// DELETE ENTREE WITH ARTICLES
exports.deleteGasoilEntree = catchAsync(async (req, res, next) => {
  // DELETE
  const doc = await db.GasoilEntree.destroy({ where: { id: req.params.id } });
  if (!doc) {
    return next(new AppError(`This document doesn't exist`, 404));
  }
  // DELETE ENTREE HISTORY
  let obj = {
    data: "deletedAt",
    prevVal: null,
    newVal: "has been deleted",
    GasoilEntreeId: req.params.id,
    UserId: req.user.id,
  };
  await db.GasoilEntreeHistory.create(obj);

  sendRes(res, 200, doc);
  return next();
});

const GasoilEntreeInclude = [
  { model: db.Fournisseur, attributes: ["id", "name"] },
];
exports.getOneGasoilEntree = reqHandler.FindOne(
  db.GasoilEntree,
  GasoilEntreeInclude
);
