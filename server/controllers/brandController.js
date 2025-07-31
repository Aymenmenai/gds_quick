const db = require("../../models");
const reqHandler = require("./reqHandler");

exports.findBrand = reqHandler.Options(db.Brand);
exports.getAllBrand = reqHandler.Find(db.Brand, [], false);
exports.getOneBrand = reqHandler.FindOne(db.Brand);
exports.deleteBrand = reqHandler.DeleteOne(
  db.Brand,
  db.BrandHistory,
  "BrandId"
);
exports.updateBrand = reqHandler.UpdateOne(
  db.Brand,
  db.BrandHistory,
  "BrandId"
);
exports.createBrand = reqHandler.Create(db.Brand);
