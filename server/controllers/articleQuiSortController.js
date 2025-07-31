const { Op } = require("sequelize");
const { sequelize } = require("../../models");
const db = require("../../models");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sendRes = require("../utils/sendRes");
const reqHandler = require("./reqHandler");
const recalculateRefQuantity = require("../v2/recalculateRefQuantity");

//===================================================================================================================
//===================================================================================================================
// CREATE ARTICLE QUI SORT
exports.addArticleQuiSort = catchAsync(async (req, res, next) => {
  for (let aqs in req.body) {
    // console.log(req.body[aqs].ArticleId);
    const article = await db.Article.findOne({
      where: { id: req.body[aqs].ArticleId },
    });
    // FOR STOCKS
    // CHECK IF THE QUANTITY WANTED AVALIBLE
    if (article.quantity < req.body[aqs].quantity) {
      return next(new AppError(`there are no enough quantity in article`, 404));
    }
    // CALCULATE THE SIMPLE PRICE
    // UPDTAE STOCK

    await db.Article.update(
      { quantity: article.quantity - req.body[aqs].quantity },
      { where: { id: req.body[aqs].ArticleId } }
    );

    // CHECK IF STOCK OUT EXIST
    const sortie = await db.Sortie.findOne({
      where: { id: req.body[aqs].SortieId },
    });

    if (!sortie) {
      return next(new AppError(`There is no enter like this`, 404));
    }
    // CALCULATE THE PRICE
    sortie.total_price =
      sortie.total_price + article.price * req.body[aqs].quantity;
    sortie.save();

    // UPDATE STOCKOUT TOTAL PRICE
    // CREATE STOCK
    const ArticleQuiSortId = await db.ArticleQuiSort.create({
      quantity: req.body.quantity || 0,
      date: req.body.date || new Date(Date.now()),
      SortieId: req.body[aqs].SortieId,
      ArticleId: req.body[aqs].ArticleId,
      UserId: req.user.id,
      MagazinId: req.user.MagazinId,
      price: article.price,
    });
    await db.ArticleQuiSortHistory.create({
      data: "createdAt",
      prevVal: null,
      newVal: null,
      ArticleQuiSortId: ArticleQuiSortId.id,
      UserId: req.user.id,
    });
  }
  if (req.body.length > 0) {
    const article = await db.Article.findByPk(req.body[0].ArticleId);
    if (article?.RefId) {
      await recalculateRefQuantity(article.RefId);
    }
  }

  res.status(201).json({
    status: "success",
  });
  return next();
});

// DELETE ONE
exports.deleteArticleQuiSort = catchAsync(async (req, res, next) => {
  const { quantities, aqs } = req;

  const article = await db.Article.findOne({
    where: { id: aqs.ArticleId },
    attributes: ["id", "initial_quantity", "quantity", "RefId"],
  });

  // NEW QUANTITY OF ARTICLE
  const curr = article.quantity + aqs.quantity;

  // REQUESTION
  // SORTIE
  await db.ArticleQuiSort.destroy({ where: { id: aqs.id } });
  // ARTICLE
  await db.Article.update({ quantity: curr }, { where: { id: article.id } });

  // PRIX TOTAL SORTIE
  const totalPrice = await db.ArticleQuiSort.findAll({
    where: { SortieId: aqs.SortieId },
    attributes: [[db.sequelize.literal("SUM(price * quantity)"), "result"]],
    raw: true,
  });

  await db.Sortie.update(
    { total_price: totalPrice[0].result ? totalPrice[0].result : 0 },
    { where: { id: aqs.SortieId } }
  );

  await db.ArticleQuiSortHistory.create({
    data: "deletedAt",
    prevVal: null,
    newVal: "has been deleted",
    ArticleQuiSortId: aqs.id,
    UserId: req.user.id,
  });

  if (article?.RefId) {
    await recalculateRefQuantity(article.RefId);
  }

  res.status(201).json({
    status: "success",
  });
  return next();
});

// UPDTATE ONE
exports.updateArticleQuiSort = catchAsync(async (req, res, next) => {
  const { quantities, aqs, quantity } = req;

  // console.log(aqs.Sortie.date, aqs, "00000000000000000");
  // console.log(quantities, quantity, aqs.Sortie);
  // SEARCH THE ARTICLE
  const article = await db.Article.findOne({
    where: { id: aqs.ArticleId },
    attributes: ["id", "initial_quantity", "quantity"],
  });

  const last_countage = await db.ArticleCountage.findOne({
    where: {
      ArticleId: aqs.ArticleId,
      date: {
        [Op.lte]: aqs.Sortie.date,
      },
    },
    order: [["date", "DESC"]],
  });

  const final_countage = await db.ArticleCountage.findOne({
    where: {
      ArticleId: aqs.ArticleId,
    },
    order: [["date", "DESC"]],
  });

  // CHECK QUANTITIES
  // HOW MUCH QUANTITIES I CAN ADD
  const quantityAdded =
    (last_countage ? last_countage.quantity : article.initial_quantity) -
    (+quantities - aqs.quantity);
  // check if it's minus

  // I need touse the date
  const q = quantity > quantityAdded ? quantityAdded : quantity;

  const curr = quantityAdded - q;

  // REQUESTION
  await db.ArticleQuiSort.update({ quantity: q }, { where: { id: aqs.id } });
  // console.log(final_countage.date <= last_countage.date, !final_countage);
  // ARTICLE
  if (
    final_countage ? final_countage.date <= last_countage.date : !final_countage
  ) {
    await db.Article.update({ quantity: curr }, { where: { id: article.id } });
  }

  // PRIX TOTAL SORTIE
  const totalPrice = await db.ArticleQuiSort.findAll({
    where: { SortieId: aqs.SortieId },
    attributes: [[db.sequelize.literal("SUM(price * quantity)"), "result"]],
    raw: true,
  });

  await db.Sortie.update(
    { total_price: totalPrice[0].result },
    { where: { id: aqs.SortieId } }
  );

  await db.ArticleQuiSortHistory.create({
    data: "quantity",
    prevVal: req.aqs.quantity,
    newVal: q,
    ArticleQuiSortId: aqs.id,
    UserId: req.user.id,
  });

  // console.log(req.aqs.quantity,q);

  // DELETE ALL MIDDLEWARES
  // PREPARE FOR MIDDLEWARE
  req.quantity = undefined;
  req.quantities = undefined;
  req.aqs = undefined;
  req.id = undefined;

  const articleUpdated = await db.Article.findByPk(aqs.ArticleId);
  if (articleUpdated?.RefId) {
    await recalculateRefQuantity(articleUpdated.RefId);
  }

  // SEND RESPONSE
  res.status(201).json({
    status: "success",
  });

  return next();
});
//===================================================================================================================
//===================================================================================================================

// FIND ALL ARTICLEQUISORT
exports.getAllArticleQuiSort = reqHandler.Find(db.ArticleQuiSort, [
  {
    model: db.Article,
    attributes: ["id", "name"],
    subQuery: false,
    include: [
      {
        model: db.Entree,
        attributes: ["id", "number"],
        include: [{ model: db.Fournisseur, attributes: ["name", "id"] }],
      },
      {
        model: db.Ref,
        attributes: ["name", "ReferenceId"],
        include: [{ model: db.Reference, attributes: ["id"] }],
      },
      {
        model: db.SousFamily,
        attributes: ["name"],
      },
      {
        model: db.Unit,
        attributes: ["name"],
      },
      { model: db.Brand, attributes: ["name"] },
      { model: db.Tag, attributes: ["name"] },
    ],
  },
  {
    model: db.Sortie,
    attributes: ["id", "number"],
    include: [{ model: db.Beneficiare, attributes: ["name", "id"] }],
  },
]);

// FIND ONE ARTICLEQUISORT
exports.getOneArticleQuiSort = reqHandler.FindOne(db.ArticleQuiSort);

// AGGRIGATION
exports.getAggregation = catchAsync(async (req, res, next) => {
  // CHECK MAIN STATE
  const id = req.id ? req.id : req.params.id;

  // console.log(id, req.params.id);
  // GET TARGET ARTICLE QUE SORT
  const aqs = await db.ArticleQuiSort.findOne({
    where: { id },
    attributes: ["id", "quantity", "ArticleId", "SortieId"],
    include: [{ model: db.Sortie, attributes: ["date"] }],
  });

  // BRING TOTAL QUANTITY OF THAT ACRTICLE
  const quantities = await db.ArticleQuiSort.findAll({
    where: { ArticleId: aqs.ArticleId },
    attributes: [[sequelize.fn("SUM", sequelize.col("quantity")), "sum"]],
    include: [
      {
        model: db.Sortie,
        attributes: [], // Don't need to select date here
        where: {
          date: {
            [Op.gte]: aqs.Sortie.date,
          },
        },
      },
    ],
    raw: true,
  });

  console.log(quantities);
  // PREPARE FOR MIDDLEWARE
  req.quantity = req.id ? req.quantity : req.body.quantity;
  req.quantities = quantities[0].sum;
  req.aqs = aqs;

  // VIEW THE RESULTS
  // console.log(req.id, req.quantity, req.body.quantity);
  // console.log(req.quantity, "[Q]");

  next();
});

// // EXPORTING
// const exportHeader = [
//   { key: "Article.Ref.name", header: "Reference", width: 25 },
//   { key: "Article.name", header: "Designiation", width: 25 },
//   { key: "date", header: "La date", width: 25 },
//   { key: "price", header: "Prix", width: 25 },
//   { key: "quantity", header: "Quantite", width: 25 },
//   { key: "Article.SousFamily.name", header: "Sous Family", width: 25 },
//   { key: "Article.Unit.name", header: "Unite", width: 25 },
//   // { key: "Article.Entree.number", header: "Bon d'entree", width: 25 },
//   // { key: "Article.Entree.Fournisseur.name", header: "Le fournisseur", width: 25 },
//   { key: "Sortie.number", header: "Bon d'sortie", width: 25 },
//   { key: "Sortie.Beneficiare.name", header: "Le Beneficiare", width: 25 },
// ];

// // CREATE ARTICLE QUI SORT
// exports.addArticleQuiSort = catchAsync(async (req, res, next) => {
//   for (let aqs in req.body) {
//     const sortie = await db.Sortie.findOne({
//       where: { id: req.body[aqs].SortieId },
//     });

//     if (!sortie) {
//       return next(new AppError(`There is no enter like this`, 404));
//     }

//     if (sortie.isValid || sortie.isDFCValid) {
//         return next(new AppError(`Sortie cannot be deleted`, 400));
//     }

//     // console.log(req.body);
//     const article = await db.Article.findOne({
//       where: { id: req.body[aqs].ArticleId },
//     });

//     // FOR STOCKS
//     // CHECK IF THE QUANTITY WANTED AVALIBLE
//     // if (article.quantity < req.body[aqs].quantity) {
//     //   return next(new AppError(`there are no enough quantity in article`, 404));
//     // }
//     // CALCULATE THE SIMPLE PRICE
//     // UPDTAE STOCK
//     await db.Article.update(
//       { quantity: article.quantity - req.body[aqs].quantity },
//       { where: { id: req.body[aqs].ArticleId } }
//     );

//     // CHECK IF STOCK OUT EXIST

//     // CALCULATE THE PRICE
//     sortie.total_price =
//       sortie.total_price + article.price * req.body[aqs].quantity;
//     sortie.save();

//     // UPDATE STOCKOUT TOTAL PRICE
//     // CREATE STOCK
//     const ArticleQuiSortId = await db.ArticleQuiSort.create({
//       quantity: req.body.quantity || 0,
//       date: req.body.date || new Date(Date.now()),
//       SortieId: req.body[aqs].SortieId,
//       ArticleId: req.body[aqs].ArticleId,
//       UserId: req.user.id,
//       MagazinId: req.user.MagazinId,
//       price: article.price,
//     });
//     await db.ArticleQuiSortHistory.create({
//       data: "createdAt",
//       prevVal: null,
//       newVal: null,
//       ArticleQuiSortId: ArticleQuiSortId.id,
//       UserId: req.user.id,
//     });
//   }

//   res.status(201).json({
//     status: "success",
//   });
//   return next();
// });

// // DELETE ONE
// exports.deleteArticleQuiSort = catchAsync(async (req, res, next) => {
//   const { quantities, aqs } = req;

//   const sortie = await db.Sortie.findOne({
//     where: { id: aqs.SortieId },
//   });

//   if (!sortie) {
//     return next(new AppError(`There is no enter like this`, 404));
//   }

//   if (sortie.isValid || sortie.isDFCValid) {
//       return next(new AppError(`Sortie cannot be deleted`, 400));
//   }

//   const article = await db.Article.findOne({
//     where: { id: aqs.ArticleId },
//     attributes: ["id", "initial_quantity", "quantity"],
//   });

//   // NEW QUANTITY OF ARTICLE
//   const curr = article.quantity + aqs.quantity;

//   // REQUESTION
//   // SORTIE
//   await db.ArticleQuiSort.destroy({ where: { id: aqs.id } });
//   // ARTICLE
//   await db.Article.update({ quantity: curr }, { where: { id: article.id } });

//   // PRIX TOTAL SORTIE
//   const totalPrice = await db.ArticleQuiSort.findAll({
//     where: { SortieId: aqs.SortieId },
//     attributes: [[db.sequelize.literal("SUM(price * quantity)"), "result"]],
//     raw: true,
//   });

//   await db.Sortie.update(
//     { total_price: totalPrice[0].result ? totalPrice[0].result : 0 },
//     { where: { id: aqs.SortieId } }
//   );

//   await db.ArticleQuiSortHistory.create({
//     data: "deletedAt",
//     prevVal: null,
//     newVal: "has been deleted",
//     ArticleQuiSortId: aqs.id,
//     UserId: req.user.id,
//   });

//   res.status(201).json({
//     status: "success",
//   });
//   return next();
// });

// // UPDTATE ONE
// exports.updateArticleQuiSort = catchAsync(async (req, res, next) => {
//   const { quantities, aqs, quantity } = req;

//   const sortie = await db.Sortie.findOne({
//     where: { id: aqs.SortieId },
//   });

//   if (!sortie) {
//     return next(new AppError(`There is no enter like this`, 404));
//   }

//   if (sortie.isValid || sortie.isDFCValid) {
//     return next(new AppError(`Sortie cannot be deleted`, 400));
//   }

//   // Get the article
//   const article = await db.Article.findOne({
//     where: { id: aqs.ArticleId },
//     attributes: ["id", "quantity"],
//   });

//   // STEP 1: Add back the old quantity
//   let tempQuantity = article.quantity + aqs.quantity;

//   // STEP 2: Subtract the new quantity
//   const updatedQuantity = tempQuantity - quantity;

//   // Update ArticleQuiSort with new quantity
//   await db.ArticleQuiSort.update({ quantity }, { where: { id: aqs.id } });

//   // Update the article's quantity (can go negative)
//   await db.Article.update({ quantity: updatedQuantity }, { where: { id: article.id } });

//   // Recalculate the total price of the sortie
//   const totalPrice = await db.ArticleQuiSort.findAll({
//     where: { SortieId: aqs.SortieId },
//     attributes: [[db.sequelize.literal("SUM(price * quantity)"), "result"]],
//     raw: true,
//   });

//   await db.Sortie.update(
//     { total_price: totalPrice[0].result },
//     { where: { id: aqs.SortieId } }
//   );

//   // Log the quantity change
//   await db.ArticleQuiSortHistory.create({
//     data: "quantity",
//     prevVal: req.aqs.quantity,
//     newVal: quantity,
//     ArticleQuiSortId: aqs.id,
//     UserId: req.user.id,
//   });

//   // Clean up request object
//   req.quantity = undefined;
//   req.quantities = undefined;
//   req.aqs = undefined;
//   req.id = undefined;

//   // Send response
//   res.status(201).json({
//     status: "success",
//   });

//   return next();
// });

// // FIND ALL ARTICLEQUISORT
// exports.getAllArticleQuiSort = reqHandler.Find(db.ArticleQuiSort, [
//   {
//     model: db.Article,
//     attributes: ["id", "name"],
//     subQuery: false,
//     include: [
//       {
//         model: db.Entree,
//         attributes: ["id", "number"],
//         include: [{ model: db.Fournisseur, attributes: ["name", "id"] }],
//       },
//       {
//         model: db.Ref,
//         attributes: ["name", "ReferenceId"],
//         include: [{ model: db.Reference, attributes: ["id"] }],
//       },
//       {
//         model: db.SousFamily,
//         attributes: ["name"],
//       },
//       {
//         model: db.Unit,
//         attributes: ["name"],
//       },
//       { model: db.Brand, attributes: ["name"] },
//       { model: db.Tag, attributes: ["name"] },
//     ],
//   },
//   {
//     model: db.Sortie,
//     attributes: ["id", "number"],
//     include: [{ model: db.Beneficiare, attributes: ["name", "id"] }, {
//       model: db.Vehicule,
//       include: [
//         {
//           model: db.VehiculeType,
//           include: [{ model: db.Brand, attributes: ["id", "name"] }],
//         },
//         {
//           model: db.VehiculeClient,
//           attributes: ["name"],
//           required: false, // Include vehicles even if they don't have a client
//         },
//       ],
//     },],
//   },
// ]);

// // FIND ONE ARTICLEQUISORT
// exports.getOneArticleQuiSort = reqHandler.FindOne(db.ArticleQuiSort);

// // AGGRIGATION
// exports.getAggregation = catchAsync(async (req, res, next) => {
//   // CHECK MAIN STATE
//   const id = req.id ? req.id : req.params.id;

//   // console.log(id, req.params.id);
//   // GET TARGET ARTICLE QUE SORT
//   const aqs = await db.ArticleQuiSort.findOne({
//     where: { id },
//     attributes: ["id", "quantity", "ArticleId", "SortieId"],
//   });

//   // BRING TOTAL QUANTITY OF THAT ACRTICLE
//   const quantities = await db.ArticleQuiSort.findAll({
//     where: { ArticleId: aqs.ArticleId },
//     attributes: [sequelize.fn("SUM", sequelize.col("quantity"))],
//     raw: true,
//   });

//   // console.log(quantities)
//   // PREPARE FOR MIDDLEWARE
//   req.quantity = req.id ? req.quantity : req.body.quantity;
//   req.quantities = quantities[0].sum;
//   req.aqs = aqs;

//   // VIEW THE RESULTS
//   // console.log(req.id, req.quantity, req.body.quantity);
//   // console.log(req.quantity, "[Q]");

//   next();
// });

// exports.getExportArticles = reqHandler.ExportFile(
//   db.ArticleQuiSort,
//   [
//     {
//       model: db.Article,
//       attributes: ["id", "name"],
//       subQuery: false,
//       include: [
//         {
//           model: db.Entree,
//           attributes: ["id", "number"],
//           include: [{ model: db.Fournisseur, attributes: ["name", "id"] }],
//         },
//         {
//           model: db.Ref,
//           attributes: ["name", "ReferenceId"],
//           include: [{ model: db.Reference, attributes: ["id"] }],
//         },
//         {
//           model: db.SousFamily,
//           attributes: ["name"],
//         },
//         {
//           model: db.Unit,
//           attributes: ["name"],
//         },
//         { model: db.Brand, attributes: ["name"] },
//         { model: db.Tag, attributes: ["name"] },
//       ],
//     },
//     {
//       model: db.Sortie,
//       attributes: ["id", "number"],
//       include: [{ model: db.Beneficiare, attributes: ["name", "id"] }],
//     },
//   ],
//   exportHeader
// );

// // MAINTENANCE
// // exports.getAllArticleQuiSort = catchAsync(async(req,res,next)=>{
// //     const MagazinId = 1;
// //     const aqs = await db.ArticleQuiSort.findAll({where:{MagazinId},include:[
// //       {
// //     model: db.Sortie,
// //     attributes: ["id", "number","MagazinId"],
// //   },
// //     ]})
// //     const uniqueSortieIds = [...new Set(aqs.map(a => a.SortieId))];
// //     await db.Sortie.update({MagazinId},{where : {id:uniqueSortieIds}})

// //     sendRes(res,200,uniqueSortieIds)

// // })
