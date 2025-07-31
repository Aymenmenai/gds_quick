const { includes } = require("lodash");
const db = require("../../models");
const catchAsync = require("../utils/catchAsync");
const generateRef = require("../utils/generateRef");
const sendRes = require("../utils/sendRes");
const reqHandler = require("./reqHandler");

let getAllInclude = [
  {
    model: db.Ref,
    as: "Refs",
    attributes: ["name"],
    required: false,
    // include: [
    //   {
    //     model: db.Article,
    //     attributes: ["quantity"],
    //     include: [{ model: db.Tag, attributes: ["name"] }],
    //   },
    // ],
  },
];

exports.findandGenerate = catchAsync(async (req, res, next) => {
  const id = await db.Ref.findOne({ where: { id: req.params.id } });
  // console.log(id, "what;s that");
  if (!id.ReferenceId) {
    const number = await db.Reference.count();
    const newRef = await db.Reference.create({
      name: generateRef(number + 1),
      UserId: req.user.id,
      MagazinId: req.user.MagazinId,
    });
    await id.update({ ReferenceId: newRef.id });
    id.save();
    sendRes(res, 200, newRef);
    return next();
  }
  const reference = await db.Reference.findOne({
    where: { id: id.ReferenceId },
  });
  sendRes(res, 200, reference);
  return next();
});

exports.searchAllReference = reqHandler.Search(
  db.Ref,
  db.Reference,
  getAllInclude,
  "ReferenceId"
);
exports.getAllReference = reqHandler.Find(db.Reference, getAllInclude);
// exports.getAllReference = catchAsync(async (req, res, next) => {
//   const refs = await db.Reference.findAll({
//     attributes: ['name', 'id'],
//     include: [{
//       model: db.Ref,
//       attributes: ['name'],
//     }]
//   });

//   const refsToDelete = refs.filter(ref => ref.Refs.length === 0);
//   const refsToUpdate = refs.filter(ref => ref.Refs.length > 0);

//   // Delete references without associated Refs
//   for (const ref of refsToDelete) {
//     await db.Reference.destroy({ where: { id: ref.id } });
//   }

//   // Update references with associated Refs
//   for (const ref of refsToUpdate) {
//     let updated = false;

//     for (const refName of ref.Refs) {
//       try {
//         // Try updating the reference's name
//         await db.Reference.update(
//           { name: refName.name },
//           { where: { id: ref.id } }
//         );
//         updated = true; // Update successful
//         break;
//       } catch (err) {
//         if (err.name === "SequelizeUniqueConstraintError") {
//           continue; // Skip to the next name if a conflict occurs
//         } else {
//           throw err; // Throw other errors
//         }
//       }
//     }

//     if (!updated) {
//       // If no unique name could be set, merge the Refs of conflicting references
//       const duplicateRef = await db.Reference.findOne({
//         where: { name: ref.name },
//         include: [{ model: db.Ref }]
//       });

//       if (duplicateRef) {
//         // Move all Refs from the duplicate reference to the current one
//         for (const duplicateRefName of duplicateRef.Refs) {
//           await db.Ref.update(
//             { ReferenceId: ref.id }, // Update to the current reference
//             { where: { id: duplicateRefName.id } }
//           );
//         }

//         // Delete the duplicate reference
//         await db.Reference.destroy({ where: { id: duplicateRef.id } });
//       }
//     }
//   }

//   // Send the updated references
//   const updatedRefs = await db.Reference.findAll({
//     attributes: ['name', 'id'],
//     include: [{
//       model: db.Ref,
//       attributes: ['name'],
//     }]
//   });

//   sendRes(res, 200, updatedRefs);
// });

exports.getOneReference = catchAsync(async (req, res, next) => {
  const reference = await db.Reference.findOne({
    where: { id: req.params.id },
  });
  // console.log(reference, "what;s that");
  // if (!id.ReferenceId) {
  //   const number = await db.Reference.count();
  //   const newRef = await db.Reference.create({
  //     name: generateRef(number + 1),
  //     UserId: req.user.id,
  //     MagazinId: req.user.MagazinId,
  //   });
  //   await id.update({ ReferenceId: newRef.id });
  //   id.save();
  //   sendRes(res, 200, newRef);
  //   return next();
  // }
  // const reference = await db.Reference.findOne({
  //   where: { id: id.ReferenceId },
  // });
  sendRes(res, 200, reference);
  return next();
});

exports.deleteReference = reqHandler.DeleteOne(
  db.Reference,
  db.ReferenceHistory,
  "ReferenceId"
);
exports.updateReference = reqHandler.UpdateOne(
  db.Reference,
  db.ReferenceHistory,
  "ReferenceId"
);
exports.createReference = catchAsync(async (req, res, next) => {
  // console.log(req.body)
  // const number = await db.Reference.count();
  const newRef = await db.Reference.create({
    name: req.body.refName,
    alert: req.body.refAlert || 0,
    UserId: req.user.id,
    MagazinId: req.user.MagazinId,
  });
  // await db.ReferenceHistory.create({
  //   data: "createdAt",
  //   prevVal: null,
  //   newVal: null,
  //   ReferenceId: newRef.id,
  //   UserId: req.user.id,
  // });
  // console.log('[NUMBER]',newRef)
  sendRes(res, 200, newRef);
});
