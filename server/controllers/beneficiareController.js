const { Op } = require("sequelize");
const db = require("../../models");
const QueryBuilder = require("../utils/QueryBuilder");
const sendRes = require("../utils/sendRes");
const reqHandler = require("./reqHandler");

exports.findBeneficiare = reqHandler.Options(db.Beneficiare);
exports.getAllBeneficiare = reqHandler.Find(db.Beneficiare, [
  {
    model: db.User,
    attributes: ["name"],
  },
], false);
// exports.getAllBeneficiare = async (req, res, next) => {
//   try {
//     const queryBuilder = new QueryBuilder(req.query);
//     const { result } = queryBuilder
//       .buildSorting()
//       .buildFilter()
//       .buildAttributes();

//     // Build and clean query based on model type
//     const cleanedQuery = { ...result };

//     // cleanedQuery.where = { ...cleanedQuery.where, MagazinId: req.user.MagazinId };

//     // Define includes with BeneficiareHistory and User models
//     const include = [
//       {
//         model: db.BeneficiareHistory,
//         where: { data: "name" },
//         order: [['createdAt', 'DESC']],
//         limit: 1, // Only get the latest BeneficiareHistory entry
//         attributes: ["prevVal", "data", "createdAt", "UserId"],
//         include: [
//           {
//             model: db.User,
//             attributes: ["name"],
//           },
//         ],
//       },
//       {
//         model: db.User,
//         attributes: ["name"],
//       },
//     ];

//     // Fetch the main documents with the optimized query
//     const doc = await db.Beneficiare.findAll({
//       include,
//       ...cleanedQuery,
//       required: true,
//       duplicating: false,
//     });

//     // Calculate total document length
//     const { limit, offset, page, ...restQuery } = cleanedQuery;
//     const totalDocs = await db.Beneficiare.count({ ...restQuery, include });

//     // If no documents found, return a success response with empty data
//     if (totalDocs === 0) {
//       sendRes(res, 200, {
//         doc_size: 0,
//         pages: 1,
//         currPage: 1,
//         data: [],
//       });
//       return next();
//     }

//     // Transform BeneficiareHistories to an object if not empty
//     const data = doc.map(item => {
//       const plainItem = item.get({ plain: true });

//       // Convert BeneficiareHistories array to object
//       if (plainItem.BeneficiareHistories && plainItem.BeneficiareHistories.length > 0) {
//         plainItem.BeneficiareHistories = plainItem.BeneficiareHistories[0];
//       } else {
//         plainItem.BeneficiareHistories = {}; // Return as empty object if no history
//       }

//       return plainItem;
//     });

//     // Calculate pages based on limit and totalDocs
//     const totalPages = limit ? Math.ceil(totalDocs / limit) : 1;

//     sendRes(res, 200, {
//       doc_size: totalDocs,
//       pages: totalPages,
//       currPage: +req.query.page || 1,
//       data,
//     });
//     return next();
//   } catch (err) {
//     console.error(err);
//     return next();
//   }
// };

// exports.clean = async (req, res, next) => {
//   try {
//     const b = await db.Beneficiare.findAll({
//       where: {
//         [Op.not]: { UserId: 8 }
//       },
//       include: [{ model: db.User }, { model: db.Sortie }],
//       order: [["name", "DESC"]]
//     })
//     // DELETE THE ONE THAT HAS NO SORTIE
//     const noSortieBeneficiareIds = b.filter(a => a.Sorties.length <= 0).map(a => a.id)
//     await db.Beneficiare.destroy({
//       where: {
//         id: noSortieBeneficiareIds // Keep only ids other than mainId
//       }
//     });
//     // console.log(noSortieBeneficiareIds.length)
//     const clean_beneficiares = []
//     const newB = [];
//     b.forEach(e => {
//       if (!noSortieBeneficiareIds.includes(e.id)) {
//         const nameParts = e.name.split(' ');
//         const lastPart = nameParts.pop();
//         const name = isNaN(lastPart) ? nameParts.join(" ") + " " + lastPart : nameParts.join(" ");
//         newB.push({ id: e.id, name, field: name.split(" ").join("") });
//       }
//     });
//     // CLEAN
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

//     // Convert groupedMap to clean_beneficiares array
//     groupedMap.forEach(group => {
//       clean_beneficiares.push(group);
//     });

//     const newBB = clean_beneficiares.filter(a => a.ids.length > 1)
//     // GET ALL SORTIE FOR THE MAIN AND UPGATE
//     // console.log(newBB[0].ids)
//     // const sortie = await db.Sortie.findAll({ where: { BeneficiareId: newBB[0].ids } })
//     // DELETE ALL EXTRA BENEFICARE 

//     // Process each group
//     for (const group of newBB) {
//       const { ids, mainId, name } = group;

//       // Update Sortie records to set BeneficiareId to mainId
//       await db.Sortie.update(
//         { BeneficiareId: mainId },
//         { where: { BeneficiareId: ids } }
//       );

//       // Delete all Fournisseur entries except the one with mainId
//       await db.Beneficiare.destroy({
//         where: {
//           id: ids.filter(id => id !== mainId) // Keep only ids other than mainId
//         }
//       });
//       await db.Beneficiare.update({ name }, { where: { id: mainId } })
//     }


//     sendRes(res, 200, "finished")
//   } catch (err) {
//     res.status(404).json({
//       status: "error",
//       err
//     })
//   }
// }

exports.getOneBeneficiare = reqHandler.FindOne(db.Beneficiare, [{ model: db.Sortie }]);
exports.deleteBeneficiare = reqHandler.DeleteOne(
  db.Beneficiare,
  db.BeneficiareHistory,
  "BeneficiareId"
);
exports.updateBeneficiare = reqHandler.UpdateOne(
  db.Beneficiare,
  db.BeneficiareHistory,
  "BeneficiareId"
);
exports.createBeneficiare = reqHandler.Create(db.Beneficiare);
