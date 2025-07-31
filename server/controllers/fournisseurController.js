const { Op } = require("sequelize");
const db = require("../../models");
const sendRes = require("../utils/sendRes");
const reqHandler = require("./reqHandler");
const QueryBuilder = require("../utils/QueryBuilder");
const catchAsync = require("../utils/catchAsync");

exports.findFournisseur = reqHandler.Options(db.Fournisseur);
exports.getAllFournisseur = reqHandler.Find(db.Fournisseur, [], false);

// exports.getAllFournisseur = async (req, res, next) => {
//  try {
//     const b = await db.Fournisseur.findAll({
//       where: {
//         [Op.not]: { UserId: 8 }
//       },
//       include: [{ model: db.User }, { model: db.Entree }],
//       order: [["name", "DESC"]]
//     })
// //     // DELETE THE ONE THAT HAS NO SORTIE
//     const noEntreeFournisseurIds = b.filter(a => a.Entrees.length <= 0).map(a => a.id)
//     await db.Fournisseur.destroy({
//       where: {
//         id: noEntreeFournisseurIds // Keep only ids other than mainId
//       }
//     });
//     // console.log(noEntreeFournisseurIds.length)
//     const clean_fournisseur = []
//     const newB = [];
//     b.forEach(e => {
//       if (!noEntreeFournisseurIds.includes(e.id)) {
//         const nameParts = e.name.split(' ');
//         const lastPart = nameParts.pop();
//         const name = isNaN(lastPart) ? nameParts.join(" ") + " " + lastPart : nameParts.join(" ");
//         newB.push({ id: e.id, name, field: name.split(" ").join("") });
//       }
//     });
// //     // CLEAN
//     const groupedMap = new Map();

//     newB.forEach(item => {
//       const { field, id, name } = item;

//       // If the field group does not exist yet, create it
//       if (!groupedMap.has(field)) {
//         groupedMap.set(field, { name, field, ids: [id], mainId: id });
//       } else {
//         const group = groupedMap.get(field);
//         group.ids.push(id); // Add current id to the group
//       }
//     });

// //     // Convert groupedMap to clean_beneficiares array
//     groupedMap.forEach(group => {
//       clean_fournisseur.push(group);
//     });

//     const newBB = clean_fournisseur.filter(a => a.ids.length > 1)
//     // GET ALL SORTIE FOR THE MAIN AND UPGATE
//     // console.log(newBB[0].ids)
//     const entree = await db.Entree.findAll({ where: { FournisseurId: newBB[0].ids } })
// //     // DELETE ALL EXTRA BENEFICARE 

// //     // Process each group
//     for (const group of newBB) {
//       const { ids, mainId, name } = group;

// //       // Update Sortie records to set BeneficiareId to mainId
//       await db.Entree.update(
//         { FournisseurId: mainId },
//         { where: { FournisseurId: ids } }
//       );

// //       // Delete all Fournisseur entries except the one with mainId
//       await db.Fournisseur.destroy({
//         where: {
//           id: ids.filter(id => id !== mainId) // Keep only ids other than mainId
//         }
//       });
//       // let cleanName = name.trim();
//       // if (!isNaN(cleanName[cleanName.length - 1])) {
//       //   cleanName = cleanName.slice(0, -1);
//       // }

//       // await db.Fournisseur.update({ name: cleanName }, { where: { id: mainId } });
//     }


//     sendRes(res, 200, "All cool")
//   } catch (err) {
//     res.status(404).json({
//       status: "error",
//       err
//     })
//   }
// }


// exports.getAllFournisseur = catchAsync(async (req, res, next) => {
//   const fournisseurs = await db.Fournisseur.findAll({
//     where: { deletedAt: null }, // Get only active (non-deleted) fournisseurs
//     order: [["id", "ASC"]],
//   });

//   let clean_fournisseur = [];

//   for (let f of fournisseurs) {
//     let name = f.name.trim();
    
//     // Remove last character if it's a number
//     if (!isNaN(name[name.length - 1])) {
//       name = name.slice(0, -1);
//     }

//     clean_fournisseur.push({ id: f.id, name });
//   }

//   // Bulk update instead of updating one by one
//   await Promise.all(
//     clean_fournisseur.map((f) =>
//       db.Fournisseur.update({ name: f.name }, { where: { id: f.id } })
//     )
//   );

//   sendRes(res, 200, clean_fournisseur);
// });







exports.getOneFournisseur = reqHandler.FindOne(db.Fournisseur);
exports.deleteFournisseur = reqHandler.DeleteOne(
  db.Fournisseur,
  db.FournisseurHistory,
  "FournisseurId"
);

exports.updateFournisseur = reqHandler.UpdateOne(
  db.Fournisseur,
  db.FournisseurHistory,
  "FournisseurId"
);
exports.addFournisseur = reqHandler.Create(db.Fournisseur);
