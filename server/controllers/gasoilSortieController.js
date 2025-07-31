const { Op } = require("sequelize");
const db = require("../../models");
const catchAsync = require("../utils/catchAsync");
const reqHandler = require("./reqHandler");
const sendRes = require("../utils/sendRes");

exports.calculateGasoilPrice = catchAsync(async (req, res, next) => {
  // console.log(req.body,'HOODXJCHDSIUG')
  const id = req.body.GasoilSortieId || req.GasoilSortieId || null
  if (id) {
    const GasoilSortie = await db.GasoilSortie.findOne({
      where: { id },
    });

    // console.log("INSIDE PRICE", GasoilSortie);
    const total = await db.GasoilElement.findAll({
      where: { GasoilSortieId: id },
      attributes: [[db.sequelize.literal("SUM(price * quantity)"), "result"]],
      raw: true,
    });
    // console.log(total)
    GasoilSortie.total_price = total[0].result || 0;
    await GasoilSortie.save();
  }
  // console.log(total)
  sendRes(res, 200, "success");
  req.body.GasoilSortieId = undefined;
  req.GasoilSortieId = undefined
  return next();
});

exports.getYear = catchAsync(async (req, res, next) => {
  const currentYear = req.body.year || new Date().getFullYear();
  //   console.log(currentYear,'CURRENT YEAR ')
  req.year = currentYear;
  next();
});

// COUNT ENTREE
exports.count = catchAsync(async (req, res, next) => {
  // console.log(req.year);
  // Define the start and end dates for the range
  const startDate = new Date(req.year, 0, 1); // January 1st of the current year
  const endDate = new Date(req.year, 11, 31); //
  // console.log(startDate, endDate,req.user);
  const GasoilSortie = await db.GasoilSortie.findOne({
    where: {
      date: {
        [Op.between]: [startDate, endDate],
      },
      //   MagazinId: req.user.MagazinId,
    },
    order: [["createdAt", "DESC"]],
    attributes: ["number", "id", "createdAt"],
  });
  // console.log(GasoilSortie);
  sendRes(res, 200, GasoilSortie?.number || 0);
});

const allSortieInclude = [db.Beneficiare];
const getOneSortieInclude = [
  {
    model: db.Beneficiare,
    attributes: ["name"],
  },
  {
    model: db.GasoilElement,
    attributes: ["id", "quantity", "price", "date"],
    include: [
      {
        model: db.Vehicule,
        include: [
          {
            model: db.VehiculeType,
            include: [{ model: db.Brand, attributes: ["id", "name"] }],
          },
          {
            model: db.VehiculeClient,
            attributes: ["name"],
            required: false, // Include vehicles even if they don't have a client
          },
        ],
      },],

  },
];

exports.getAllGasoilSortie = reqHandler.Find(
  db.GasoilSortie,
  allSortieInclude,
  false
);
exports.getOneGasoilSortie = reqHandler.FindOne(
  db.GasoilSortie,
  getOneSortieInclude
);
exports.deleteGasoilSortie = reqHandler.DeleteOne(db.GasoilSortie);
exports.updateGasoilSortie = reqHandler.UpdateOne(db.GasoilSortie);
exports.addGasoilSortie = reqHandler.Create(db.GasoilSortie);
exports.excelExport = reqHandler.ExportFileForGasoil(db.GasoilSortie,getOneSortieInclude, [
  { field: "date", name: "Date" },
  { field: "VehiculeType.name", name: "Engin" },
  { field: "quantity", name: "Qté" },
  { field: "price", name: "Prix U HT" },
],true);
