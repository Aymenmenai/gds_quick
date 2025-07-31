const db = require("../../models");
const reqHandler = require("./reqHandler");

exports.findVehiculeClient = reqHandler.Options(db.VehiculeClient);
exports.getAllVehiculeClient = reqHandler.Find(db.VehiculeClient, [], false);
exports.getOneVehiculeClient = reqHandler.FindOne(db.VehiculeClient);
exports.deleteVehiculeClient = reqHandler.DeleteOne(
  db.VehiculeClient,
  db.VehiculeClientHistory,
  "VehiculeClientId"
);
exports.updateVehiculeClient = reqHandler.UpdateOne(
  db.VehiculeClient,
  db.VehiculeClientHistory,
  "VehiculeClientId"
);
exports.createVehiculeClient = reqHandler.Create(db.VehiculeClient);
