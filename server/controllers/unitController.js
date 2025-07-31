const db = require("../../models");
const reqHandler = require("./reqHandler");

exports.findUnit = reqHandler.Options(db.Unit);
exports.getAllUnit = reqHandler.Find(db.Unit, [], false);
exports.getOneUnit = reqHandler.FindOne(db.Unit);
exports.deleteUnit = reqHandler.DeleteOne(db.Unit, db.UnitHistory, "UnitId");
exports.updateUnit = reqHandler.UpdateOne(db.Unit, db.UnitHistory, "UnitId");
exports.createUnit = reqHandler.Create(db.Unit);
