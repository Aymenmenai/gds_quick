const db = require("../../models");
const catchAsync = require("../utils/catchAsync");
const sendRes = require("../utils/sendRes");
const reqHandler = require("./reqHandler");

exports.findRef = reqHandler.Options(db.Ref);
exports.getAllRef = reqHandler.Find(db.Ref, [{ model: db.Reference }]);
exports.getOneRef = reqHandler.FindOne(db.Ref);
exports.deleteRef = reqHandler.DeleteOne(db.Ref, db.RefHistory, "RefId");
exports.updateRef = reqHandler.UpdateOne(db.Ref, db.RefHistory, "RefId");
exports.addRef = catchAsync(async (req, res, next) => {
  // console.log({ ...req.body, UserId: req.user.id });
  const { name, ReferenceId } = req.body;
  const refy = ReferenceId || null;
  // console.log(name, refy);
  const doc = await db.Ref.create({
    name,
    ReferenceId: refy,
    UserId: req.user.id,
    MagazinId: req.user.MagazinId,
  });

  await db.RefHistory.create({
    data: "createdAt",
    prevVal: null,
    newVal: null,
    RefId: doc.id,
    UserId: req.user.id,
  });
  sendRes(res, 200, doc);
  return next();
});

exports.autoCompleteWithRef = catchAsync(async (req, res, next) => {
  const doc = await db.Ref.findOne({
    where: { id: req.params.id },
    attributes: ["id", "name"],
    include: [
      {
        model: db.Article,
        attributes: ["id"],
        include: [
          { model: db.Tag, attributes: ["id", "name"] },
          { model: db.Brand, attributes: ["id", "name"] },
          { model: db.Unit, attributes: ["id", "name"] },
          {
            model: db.SousFamily,
            include: [{ model: db.Family, attributes: ["id", "name"] }],
            attributes: ["id", "name"],
          },
        ],
      },
      { model: db.Reference, attributes: ["id", "name"] },
    ],
  });

  if (!doc) {
    return next(new AppError(`There is no  with this ID `, 404));
  }
  sendRes(res, 200, doc);
  return next();
});
