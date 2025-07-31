const db = require("../../models");
const reqHandler = require("./reqHandler")




exports.findSousFamily = reqHandler.Options(db.SousFamily)
exports.getAllSousFamily = reqHandler.Find(db.SousFamily)
exports.getOneSousFamily = reqHandler.FindOne(db.SousFamily)
exports.deleteSousFamily = reqHandler.DeleteOne(db.SousFamily,db.SousFamilyHistory,"SousFamilyId")
exports.updateSousFamily = reqHandler.UpdateOne(db.SousFamily,db.SousFamilyHistory,"SousFamilyId")
exports.createSousFamily = reqHandler.Create(db.SousFamily)

