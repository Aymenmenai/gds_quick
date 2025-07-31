const db = require("../../models");
const reqHandler = require("./reqHandler");

exports.findFeedback = reqHandler.Options(db.Feedback);
exports.getAllFeedback = reqHandler.Find(
  db.Feedback,
  [
    {
      model: db.User,
      attributes: ["name"],
      include: [{ model: db.Magazin, attributes: ["name"] }],
    },
  ],
  false
);
exports.getOneFeedback = reqHandler.FindOne(db.Feedback);
exports.deleteFeedback = reqHandler.DeleteOne(
  db.Feedback,
  db.FeedbackHistory,
  "FeedbackId"
);
exports.updateFeedback = reqHandler.UpdateOne(
  db.Feedback,
  db.FeedbackHistory,
  "FeedbackId"
);
exports.createFeedback = reqHandler.Create(db.Feedback);
