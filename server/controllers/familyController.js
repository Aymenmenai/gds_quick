const db = require("../../models");
const reqHandler = require("./reqHandler");

let getAllInclude = [
  {
    model: db.SousFamily,
    attributes: ["name"],
  },
];

exports.findFamily = reqHandler.Options(db.Family);
exports.searchAllFamily = reqHandler.Search(
  db.SousFamily,
  db.Family,
  getAllInclude,
  "FamilyId"
);
exports.getAllFamily = reqHandler.Find(db.Family, getAllInclude);
exports.getOneFamily = reqHandler.FindOne(db.Family);
exports.deleteFamily = reqHandler.DeleteOne(
  db.Family,
  db.FamilyHistory,
  "FamilyId"
);
exports.updateFamily = reqHandler.UpdateOne(
  db.Family,
  db.FamilyHistory,
  "FamilyId"
);
exports.createFamily = reqHandler.Create(db.Family);
