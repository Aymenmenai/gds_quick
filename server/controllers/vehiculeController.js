const { Sequelize } = require("sequelize");
const db = require("../../models");
const catchAsync = require("../utils/catchAsync");
const sendRes = require("../utils/sendRes");
const reqHandler = require("./reqHandler");

let getAllInclude = [
  {
    model: db.VehiculeClient,
    attributes: ["name"],
  },
  {
    model: db.VehiculeType,
    attributes: ["id", "name"],
    include: [{ model: db.Brand, attributes: ["id", "name"] }],
  },
];

exports.findVehicule = reqHandler.Options(db.Vehicule);
exports.searchAllVehicule = reqHandler.Search(
  db.VehiculeCode,
  db.Vehicule,
  getAllInclude,
  "VehiculeId"
);
exports.getAllVehicule = reqHandler.Find(db.Vehicule, getAllInclude, false);
exports.getOneVehicule = reqHandler.FindOne(db.Vehicule);
exports.deleteVehicule = reqHandler.DeleteOne(
  db.Vehicule,
  db.VehiculeHistory,
  "VehiculeId"
);
exports.updateVehicule = reqHandler.UpdateOne(
  db.Vehicule,
  db.VehiculeHistory,
  "VehiculeId"
);
exports.createVehicule = reqHandler.Create(db.Vehicule);

exports.superSearchVehicule = async (req, res, next) => {
  try {
    const term = req.params.term.toUpperCase();
    const results = await db.Vehicule.findAll({
      where: {
        [Sequelize.Op.or]: [
          { name: { [Sequelize.Op.iLike]: `%${term}%` } }, // Case-insensitive search for name
          { matricule: { [Sequelize.Op.iLike]: `%${term}%` } }, // Case-insensitive search for matricule
          { serialCode: { [Sequelize.Op.iLike]: `%${term}%` } }, // Case-insensitive search for serialCode
        ],
      },
      include: [
        {
          model: db.VehiculeClient,
          attributes: ["name"],
          required: false, // Include vehicles even if they don't have a client
        },
      ],
    });
    const formattedResults = results.map((e) => ({
      id: e.id,
      name: `${e.VehiculeClient?.name}/${e.name}/${e.matricule}/${e.serialCode}`,
    }));
    sendRes(res, 200, { data: formattedResults });
  } catch (err) {
    console.log(err);
  }
};
