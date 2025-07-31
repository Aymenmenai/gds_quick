const db = require("../../models");
const reqHandler = require("./reqHandler");

exports.findMagazin = reqHandler.Options(db.Magazin);
exports.getAllMagazin = reqHandler.Find(db.Magazin,[],false);
exports.getOneMagazin = reqHandler.FindOne(db.Magazin);
exports.deleteMagazin = reqHandler.DeleteOne(db.Magazin);
exports.updateMagazin = reqHandler.UpdateOne(db.Magazin);
exports.createMagazin = reqHandler.Create(db.Magazin);
