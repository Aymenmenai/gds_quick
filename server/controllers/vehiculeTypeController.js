const db = require("../../models");
const reqHandler = require("./reqHandler");

let getAllInclude = [
  {
    model: db.Brand,
    attributes: ["name"],
  },
];

exports.findVehiculeType = reqHandler.Options(db.VehiculeType);
exports.searchAllVehiculeType = reqHandler.Search(
  db.VehiculeTypeCode,
  db.VehiculeType,
  getAllInclude,
  "VehiculeTypeId"
);
exports.getAllVehiculeType = reqHandler.Find(db.VehiculeType, getAllInclude,false);
exports.getOneVehiculeType = reqHandler.FindOne(db.VehiculeType);
exports.deleteVehiculeType = reqHandler.DeleteOne(
  db.VehiculeType,
  db.VehiculeTypeHistory,
  "VehiculeTypeId"
);
exports.updateVehiculeType = reqHandler.UpdateOne(
  db.VehiculeType,
  db.VehiculeTypeHistory,
  "VehiculeTypeId"
);
exports.createVehiculeType = reqHandler.Create(db.VehiculeType);
