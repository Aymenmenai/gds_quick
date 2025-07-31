const db = require("../models");
const reqHandler = require("./reqHandler")




exports.getAllAttribute = reqHandler.FindAll(db.Attribute)
exports.getOneAttribute = reqHandler.FindOne(db.Attribute)
exports.deleteAttribute = reqHandler.DeleteOne(db.Attribute,db.AttributeHistory,"AttributeId")
exports.updateAttribute = reqHandler.UpdateOne(db.Attribute,db.AttributeHistory,"AttributeId")
exports.createAttribute = reqHandler.Create(db.Attribute)

