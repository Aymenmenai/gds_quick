const db = require("../models");
const reqHandler = require("./reqHandler")




exports.getAllComment = reqHandler.FindAll(db.Comment)
exports.getOneComment = reqHandler.FindOne(db.Comment)
exports.deleteComment = reqHandler.DeleteOne(db.Comment,db.CommentHistory,"CommentId")
exports.updateComment = reqHandler.UpdateOne(db.Comment,db.CommentHistory,"CommentId")
exports.createComment = reqHandler.Create(db.Comment)

