const { QueryTypes, Sequelize, Op } = require("sequelize");
const db = require("../../models");
const catchAsync = require("../utils/catchAsync");
const sendRes = require("../utils/sendRes");
const reqHandler = require("./reqHandler");
const filterObj = require("../utils/filterObj");
// const getChangedValues = require("../utils/getChangedValue");
const AppError = require("../utils/appError");
const filter = require("../v2/filter");
const recalculateRefQuantity = require("../v2/recalculateRefQuantity");
// const apiFeature = require("../utils/QueryBuilder");

const exportHeader = [
  { key: "Ref.name", header: "Reference", width: 25 },
  { key: "name", header: "Designiation", width: 25 },
  { key: "date", header: "La date", width: 25 },
  { key: "price", header: "Prix", width: 25 },
  { key: "quantity", header: "Quantite", width: 25 },
  { key: "SousFamily.name", header: "Sous Family", width: 25 },
  { key: "Unit.name", header: "Unite", width: 25 },
  { key: "Entree.number", header: "Bon d'entree", width: 25 },
  { key: "Entree.Fournisseur.name", header: "Le fournisseur", width: 25 },
];

const getAllInclude = [
  {
    model: db.Entree,
    attributes: ["number", "id"],
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
    include: [{ model: db.Family, attributes: ["name", "id"] }],
  },
  {
    model: db.Unit,
    attributes: ["name"],
  },
  { model: db.Brand, attributes: ["name"] },
  { model: db.Tag, attributes: ["name"] },
];

const getOneInclude = [
  { model: db.Attribute, attributes: ["id", "name", "value"] },
  { model: db.Unit, attributes: ["name"] },
  { model: db.SousFamily, attributes: ["name"] },
  {
    model: db.Entree,
    attributes: ["number"],
    include: [{ model: db.Fournisseur, attributes: ["name"] }],
  },
];

// ETATE DE STOCKS
exports.etateStock = async (req, res, next) => {
  try {
    // console.log('hello')
    // REQUEST WITH REF AND GROUP ALL THE QUANTITE AND MIDIAN PRICE
    const stock = await db.Ref.findAll({
      attributes: [
        "id",
        "name",
        [
          db.sequelize.fn("SUM", db.sequelize.col("Articles.quantity")),
          "totalQuantity",
        ],
      ],
      include: [
        { model: db.Article, as: "Articles", attributes: ["quantity"] },
      ],
      group: ["Ref.id", "Ref.name", "Articles.id"],
      // ,row:true
    });
    sendRes(res, 200, stock);
    // CHECK THE QUNTITYYCHANGE
    //
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }
};
// ALERT
exports.alerts = catchAsync(async (req, res, next) => {
  const result = await db.Reference.findAll({
    attributes: [
      "id",
      "name",
      "alert",
      [
        db.sequelize.fn("SUM", db.sequelize.col("Refs->Articles.quantity")),
        "quantity",
      ],
    ],

    include: [
      {
        model: db.Ref,
        as: "Refs",
        attributes: ["name"],
        include: [
          {
            model: db.Article,
            as: "Articles",
            attributes: ["quantity"],
            include: [{ model: db.Brand }, { model: db.Tag }],
          },
        ],
      },
    ],
    group: [
      "Reference.id",
      "Reference.name",
      "Refs.id",
      "Refs.Articles.id",
      "Refs.Articles->Brand.id",
      "Refs.Articles->Tag.id",
    ],
    order: [["id", "ASC"]],
  });

  const articles = result.map((item) => {
    let obj = {};
    // console.log(item)
    const brandsSet = new Set();
    const tagsSet = new Set();

    item.Refs.map((ref) => {
      if (ref.Articles) {
        ref.Articles.map((article) => {
          brandsSet.add(article?.Brand?.name);
          tagsSet.add(article?.Tag?.name);
        });
      }
    });

    obj = {
      id: item.id,
      name: item.name,
      alert: item.alert,
      totalQuantity: item.Refs.reduce(
        (acc, ref) =>
          acc +
          (ref.Articles
            ? ref.Articles.reduce((sum, article) => sum + article.quantity, 0)
            : 0),
        0
      ),
    };

    return obj;
  });

  // console.log(articles);
  let count = 0;
  articles.map((el) => {
    if (el.alert >= el.totalQuantity) {
      // console.log(el.alert >= el.totalQuantity, el.alert, el.totalQuantity);
      count = count + 1;
    }
  });

  sendRes(res, 200, count);
  return next();
});

// GET ONE STATS GROUP
exports.getOneArticle = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;
  const main = {};
  const result = await db.Reference.findAll({
    where: main,
    attributes: [
      "id",
      "name",
      "alert",
      [
        db.sequelize.fn("SUM", db.sequelize.col("Refs->Articles.quantity")),
        "quantity",
      ],
    ],

    include: [
      {
        model: db.Ref,
        as: "Refs",
        attributes: ["name"],
        include: [
          {
            model: db.Article,
            as: "Articles",
            attributes: ["BrandId", "TagId", "quantity"],
            include: [{ model: db.Brand }, { model: db.Tag }],
          },
        ],
      },
    ],
    group: [
      "Reference.id",
      "Reference.name",
      "Refs.id",
      "Refs.Articles.id",
      "Refs.Articles->Brand.id",
      "Refs.Articles->Tag.id",
    ],
    order: [["id", "ASC"]],
  });

  const articles = result.map((item) => {
    const brandsSet = new Set();
    const tagsSet = new Set();
    const refSet = new Set();

    item.Refs.forEach((ref) => {
      refSet.add(ref.name);
      if (ref.Articles) {
        ref.Articles.forEach((article) => {
          brandsSet.add(article.Brand.name);
          tagsSet.add(article.Tag.name);
        });
      }
    });

    return {
      id: item.id,
      name: item.name,
      alert: item.alert,
      refs: Array.from(refSet),
      totalQuantity: item.Refs.reduce(
        (acc, ref) =>
          acc +
          (ref.Articles
            ? ref.Articles.reduce((sum, article) => sum + article.quantity, 0)
            : 0),
        0
      ),
      brands: Array.from(brandsSet),
      tags: Array.from(tagsSet),
    };
  });
  sendRes(res, 200, { articles });
  return next();
});

// GET ALL STATS GROUP
exports.getAllArticle = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = 14; // Number of articles per page
  const offset = (page - 1) * limit;

  const ReferenceIds = await db.Reference.findAll({
    attributes: ["id"],

    order: [["id", "ASC"]],
    limit,
    offset,
  });

  // GET LENGTH
  const length = await db.Reference.count();

  const ids = ReferenceIds.map((item) => item.id);

  const main = {
    id: {
      [db.Sequelize.Op.in]: ids,
    },
  };

  const result = await db.Reference.findAll({
    where: main,
    attributes: [
      "id",
      "name",
      "alert",
      [
        db.sequelize.fn("SUM", db.sequelize.col("Refs->Articles.quantity")),
        "quantity",
      ],
    ],

    include: [
      {
        model: db.Ref,
        as: "Refs",
        attributes: ["name"],
        include: [
          {
            model: db.Article,
            as: "Articles",
            attributes: ["BrandId", "TagId", "quantity"],
            include: [{ model: db.Brand }, { model: db.Tag }],
          },
        ],
      },
    ],
    group: [
      "Reference.id",
      "Reference.name",
      "Refs.id",
      "Refs.Articles.id",
      "Refs.Articles->Brand.id",
      "Refs.Articles->Tag.id",
    ],
    order: [["id", "ASC"]],
  });

  const articles = result.map((item) => {
    const brandsSet = new Set();
    const tagsSet = new Set();
    const refSet = new Set();

    item.Refs.forEach((ref) => {
      refSet.add(ref.name);
      if (ref.Articles) {
        ref.Articles.map((article) => {
          brandsSet.add(article.Brand?.name);
          tagsSet.add(article.Tag?.name);
        });
      }
    });

    return {
      id: item.id,
      name: item.name,
      alert: item.alert,
      refs: Array.from(refSet),
      totalQuantity: item.Refs.reduce(
        (acc, ref) =>
          acc +
          (ref.Articles
            ? ref.Articles.reduce((sum, article) => sum + article.quantity, 0)
            : 0),
        0
      ),
      brands: Array.from(brandsSet),
      tags: Array.from(tagsSet),
    };
  });
  // sendRes(res, 200, { ReferenceIds });
  sendRes(res, 200, {
    doc_size: length,
    pages: !!((length / limit) % 1)
      ? Math.floor(length / limit) + 1
      : length / limit,
    currPage: +req.query.page || 1,

    articles,
  });
  return next();
});

// MAX VALUE
exports.maxValue = catchAsync(async (req, res, next) => {
  const result = await db.Article.findAll({
    limit: 1,
    order: [["price", "DESC"]],
  });

  const maxValue = result.length > 0 ? result[0].price : null;

  sendRes(res, 200, maxValue);
});

// FOR SORTIE
exports.findDesigniation = reqHandler.forSortie(db.Article, getAllInclude);
// GET NORMAL ARTICLE
exports.getAllDesigniation = reqHandler.Find(db.Article, getAllInclude);
exports.getExportArticles = reqHandler.ExportFile(
  db.Article,
  getAllInclude,
  exportHeader
);

// reqHandler.Find(db.Article, );
// GET ONE
exports.getOneDesigniation = reqHandler.FindOne(db.Article, getOneInclude);

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ADD DESIGNATION
exports.addDesigniation = catchAsync(async (req, res, next) => {
  // console.log({ ...req.body, UserId: req.user.id });
  const doc = await db.Article.create({
    ...req.body,
    initial_quantity: req.body.quantity,
    price: req.body.price * (1 + (req.body.tax || 0)),
    UserId: req.user.id,
    MagazinId: req.user.MagazinId,
  });
  await db.ArticleHistory.create({
    data: "createdAt",
    prevVal: null,
    newVal: null,
    ArticleId: doc.id,
    UserId: req.user.id,
  });

  recalculateRefQuantity(req.body.RefId);
  sendRes(res, 200, doc);
  return next();
});

// UPDATE DESIGNATION
exports.updateDesigniation = async (req, res, next) => {
  try {
    // FIND ARTICLE
    // console.log(req.body);
    const article = await db.Article.findOne({
      where: { id: req.params.id },
    });
    // console.log(article);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Get updated values from req.body
    const { tax, price, quantity } = req.body;

    // console.log(tax, price, initial_quantity, req.body, "===================");
    let updatedData = {};

    if (
      req.body.hasOwnProperty("tax") ||
      req.body.hasOwnProperty("price") ||
      req.body.hasOwnProperty("quantity")
    ) {
      // Calculate updated values based on relationships
      const updatedTax = tax !== undefined ? tax : article.tax;
      const updatedInitialQuantity =
        quantity !== undefined ? quantity : article.initial_quantity;
      const updatedPrice =
        price !== undefined
          ? price * (1 + updatedTax)
          : (article.price / (1 + article.tax)) * (1 + updatedTax);
      const updatedQuantity =
        updatedInitialQuantity - article.initial_quantity + article.quantity;

      // Update the article with the new values
      updatedData = {
        tax: updatedTax,
        price: updatedPrice,
        quantity: updatedQuantity,
        initial_quantity: updatedInitialQuantity,
      };
    }

    if (updatedData.quantity && updatedData.quantity < 0) {
      return next(new Err("impossible de mettre cette valeur", 400));
    }

    const data = filter(
      req.body,
      "UserId",
      "createdAt",
      "id",
      "quantity",
      "initial_quantity",
      "tax",
      "price"
    );

    // console.log({ ...updatedData, ...data }, "[88888888888888888]");
    // Update the article in the database
    await db.Article.update(
      { ...updatedData, ...data },
      { where: { id: article.id } }
    );

    // Create article history for the changed values

    for (const key in req.body) {
      if (article[key] && { ...updatedData, ...data }[key] !== article[key]) {
        const historyObj = {
          data: key,
          prevVal: JSON.stringify(article[key]).replace(/"/g, ""),
          newVal: { ...updatedData, ...data }[key],
          ArticleId: article.id,
          UserId: req.user.id,
        };
        await db.ArticleHistory.create(historyObj);
      }
    }

    recalculateRefQuantity(article.RefId);
    req.body.EntreeId = article.EntreeId;
    next();
  } catch (err) {
    console.log(err);
    next();
  }
};

// DELETE
exports.deleteDesigniation = catchAsync(async (req, res, next) => {
  const doc = await db.Article.findOne({ where: { id: req.params.id } });

  await db.Article.destroy({ where: { id: req.params.id } });
  let obj = {
    data: "deletedAt",
    prevVal: null,
    newVal: "has been deleted",
    ArticleId: req.params.id,
    UserId: req.user.id,
  };
  // console.log(obj);
  await db.ArticleHistory.create(obj);

  recalculateRefQuantity(doc.RefId);
  req.body.EntreeId = doc.EntreeId;
  return next();
});

exports.getArticleStockTimeline = catchAsync(async (req, res, next) => {
  //console.log("ddkdididi");
  const articleId = req.params.id;

  // 1️⃣ Get the article (with Entree + Ref)
  const article = await db.Article.findOne({
    where: { id: articleId },
    include: [
      {
        model: db.Entree,
        required: false,
      },
      {
        model: db.Ref,
        required: true,
      },
    ],
  });

  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  // 2️⃣ Load all article countages sorted ascending
  let countages = await db.ArticleCountage.findAll({
    where: { ArticleId: articleId },
    order: [
      ["date", "ASC"],
      ["createdAt", "ASC"],
    ],
  });

  // 2️⃣🅰️ Inject a virtual first countage from Entree (quantité initiale)
  if (article.Entree && article.initial_quantity != null) {
    const entreeDate = new Date(article.Entree.date);
    countages.unshift({
      quantity: article.initial_quantity,
      comment: "quantité initiale",
      date: entreeDate,
      createdAt: entreeDate,
      isVirtual: true, // just for internal use
    });
  }

  // 3️⃣ Load all ArticleQuiSort for this article (with sortie info)
  const sorties = await db.ArticleQuiSort.findAll({
    where: { ArticleId: articleId },
    include: [
      {
        model: db.Sortie,
        required: true,
      },
    ],
  });

  const result = [];

  for (let i = 0; i < countages.length; i++) {
    const current = countages[i];
    const next = countages[i + 1];

    const rangeStart = new Date(current.date);
    const rangeEnd = next ? new Date(next.date) : new Date("2100-01-01");

    const segmentTimeline = [];

    // 🔹 Countage or Initial marker
    segmentTimeline.push({
      type: current.isVirtual ? "initial" : "countage",
      date: rangeStart,
      quantity: current.quantity,
      comment: current.comment || "",
      stock_at_date: current.quantity,
    });

    // 🔹 Entree in range
    // const entree = article.Entree;
    // if (entree) {
    //   const entreeDate = new Date(entree.date);
    //   if (entreeDate >= rangeStart && entreeDate < rangeEnd) {
    //     segmentTimeline.push({
    //       type: "entree",
    //       number: entree.number,
    //       date: entree.date,
    //       article: {
    //         name: article.name,
    //         ref: article.Ref.name,
    //         designation: article.Ref.designation,
    //         initial_quantity: article.initial_quantity,
    //         price: article.price || null,
    //       },
    //       movement_quantity: article.initial_quantity,
    //     });
    //   }
    // }

    // 🔹 Sorties in range
    for (const sortieLine of sorties) {
      const sortieDate = new Date(sortieLine.Sortie.date);
      if (sortieDate >= rangeStart && sortieDate < rangeEnd) {
        segmentTimeline.push({
          type: "sortie",
          number: sortieLine.Sortie.number,
          date: sortieLine.Sortie.date,
          article: {
            name: article.name,
            ref: article.Ref.name,
            designation: article.Ref.designation,
            price: sortieLine.price || null,
          },
          movement_quantity: -sortieLine.quantity,
        });
      }
    }

    // 🔹 Sort events and compute running stock
    segmentTimeline.sort((a, b) => new Date(a.date) - new Date(b.date));
    let runningStock = current.quantity;

    for (const event of segmentTimeline) {
      if (event.type === "entree" || event.type === "sortie") {
        runningStock += event.movement_quantity;
        event.stock_at_date = runningStock;
      }
    }

    result.push({
      from: rangeStart,
      to: next ? next.date : null,
      events: segmentTimeline,
    });
  }

  // ✅ Send result
  sendRes(res, 200, {
    articleId,
    articleName: article.name,
    ref: article.Ref.name,
    timeline: result,
  });

  next();
});
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

// const exportHeader = [
//   { key: "Ref.name", header: "Reference", width: 25 },
//   { key: "name", header: "Designiation", width: 25 },
//   { key: "date", header: "La date", width: 25 },
//   { key: "price", header: "Prix", width: 25 },
//   { key: "quantity", header: "Quantite", width: 25 },
//   { key: "SousFamily.name", header: "Sous Family", width: 25 },
//   { key: "Unit.name", header: "Unite", width: 25 },
//   { key: "Entree.number", header: "Bon d'entree", width: 25 },
//   { key: "Entree.Fournisseur.name", header: "Le fournisseur", width: 25 },
// ];

// const getAllInclude = [
//   {
//     model: db.Entree,
//     attributes: ["number", "id"],
//     include: [{ model: db.Fournisseur, attributes: ["name", "id"] }],
//   },
//   {
//     model: db.Ref,
//     attributes: ["name", "ReferenceId"],
//     include: [{ model: db.Reference, attributes: ["id","alert"] }],
//   },
//   {
//     model: db.SousFamily,
//     attributes: ["name"],
//     include: [{ model: db.Family, attributes: ["name", "id"] }],
//   },
//   {
//     model: db.Unit,
//     attributes: ["name"],
//   },
//   { model: db.Brand, attributes: ["name"] },
//   { model: db.Tag, attributes: ["name"] },
// ];

// const getOneInclude = [
//   { model: db.Attribute, attributes: ["id", "name", "value"] },
//   { model: db.Unit, attributes: ["name"] },
//   { model: db.SousFamily, attributes: ["name"] },
//   {
//     model: db.Entree,
//     attributes: ["number"],
//     include: [{ model: db.Fournisseur, attributes: ["name"] }],
//   },
// ];
// // ALERT
// exports.alerts = catchAsync(async (req, res, next) => {
//   const result = await db.Reference.findAll({
//     attributes: [
//       "id",
//       "name",
//       "alert",
//       [
//         db.sequelize.fn("SUM", db.sequelize.col("Refs->Articles.quantity")),
//         "quantity",
//       ],
//     ],

//     include: [
//       {
//         model: db.Ref,
//         as: "Refs",
//         attributes: ["name"],
//         include: [
//           {
//             model: db.Article,
//             as: "Articles",
//             attributes: ["quantity"],
//             include: [{ model: db.Brand }, { model: db.Tag }],
//           },
//         ],
//       },
//     ],
//     group: [
//       "Reference.id",
//       "Reference.name",
//       "Refs.id",
//       "Refs.Articles.id",
//       "Refs.Articles->Brand.id",
//       "Refs.Articles->Tag.id",
//     ],
//     order: [["id", "ASC"]],
//   });

//   const articles = result.map((item) => {
//     let obj = {};
//     // console.log(item)
//     const brandsSet = new Set();
//     const tagsSet = new Set();

//     item.Refs.map((ref) => {
//       if (ref.Articles) {
//         ref.Articles.map((article) => {
//           brandsSet.add(article?.Brand?.name);
//           tagsSet.add(article?.Tag?.name);
//         });
//       }
//     });

//     obj = {
//       id: item.id,
//       name: item.name,
//       alert: item.alert,
//       totalQuantity: item.Refs.reduce(
//         (acc, ref) =>
//           acc +
//           (ref.Articles
//             ? ref.Articles.reduce((sum, article) => sum + article.quantity, 0)
//             : 0),
//         0
//       ),
//     };

//     return obj;
//   });

//   // console.log(articles);
//   let count = 0;
//   articles.map((el) => {
//     if (el.alert >= el.totalQuantity) {
//       // console.log(el.alert >= el.totalQuantity, el.alert, el.totalQuantity);
//       count = count + 1;
//     }
//   });

//   sendRes(res, 200, count);
//   return next();
// });

// // GET ONE STATS GROUP
// exports.getOneArticle = catchAsync(async (req, res, next) => {
//   const page = req.query.page || 1;
//   const main = {};
//   const result = await db.Reference.findAll({
//     where: main,
//     attributes: [
//       "id",
//       "name",
//       "alert",
//       [
//         db.sequelize.fn("SUM", db.sequelize.col("Refs->Articles.quantity")),
//         "quantity",
//       ],
//     ],

//     include: [
//       {
//         model: db.Ref,
//         as: "Refs",
//         attributes: ["name"],
//         include: [
//           {
//             model: db.Article,
//             as: "Articles",
//             attributes: ["BrandId", "TagId", "quantity"],
//             include: [{ model: db.Brand }, { model: db.Tag }],
//           },
//         ],
//       },
//     ],
//     group: [
//       "Reference.id",
//       "Reference.name",
//       "Refs.id",
//       "Refs.Articles.id",
//       "Refs.Articles->Brand.id",
//       "Refs.Articles->Tag.id",
//     ],
//     order: [["id", "ASC"]],
//   });

//   const articles = result.map((item) => {
//     const brandsSet = new Set();
//     const tagsSet = new Set();
//     const refSet = new Set();

//     item.Refs.forEach((ref) => {
//       refSet.add(ref.name);
//       if (ref.Articles) {
//         ref.Articles.forEach((article) => {
//           brandsSet.add(article.Brand.name);
//           tagsSet.add(article.Tag.name);
//         });
//       }
//     });

//     return {
//       id: item.id,
//       name: item.name,
//       alert: item.alert,
//       refs: Array.from(refSet),
//       totalQuantity: item.Refs.reduce(
//         (acc, ref) =>
//           acc +
//           (ref.Articles
//             ? ref.Articles.reduce((sum, article) => sum + article.quantity, 0)
//             : 0),
//         0
//       ),
//       brands: Array.from(brandsSet),
//       tags: Array.from(tagsSet),
//     };
//   });
//   sendRes(res, 200, { articles });
//   return next();
// });

// // GET ALL STATS GROUP
// exports.getAllArticle = catchAsync(async (req, res, next) => {
//   const page = req.query.page || 1;
//   const limit = 14; // Number of articles per page
//   const offset = (page - 1) * limit;

//   const ReferenceIds = await db.Reference.findAll({
//     attributes: ["id"],

//     order: [["id", "ASC"]],
//     limit,
//     offset,
//   });

//   // GET LENGTH
//   const length = await db.Reference.count();

//   const ids = ReferenceIds.map((item) => item.id);

//   const main = {
//     id: {
//       [db.Sequelize.Op.in]: ids,
//     },
//   };

//   const result = await db.Reference.findAll({
//     where: main,
//     attributes: [
//       "id",
//       "name",
//       "alert",
//       [
//         db.sequelize.fn("SUM", db.sequelize.col("Refs->Articles.quantity")),
//         "quantity",
//       ],
//     ],

//     include: [
//       {
//         model: db.Ref,
//         as: "Refs",
//         attributes: ["name"],
//         include: [
//           {
//             model: db.Article,
//             as: "Articles",
//             attributes: ["BrandId", "TagId", "quantity"],
//             include: [{ model: db.Brand }, { model: db.Tag }],
//           },
//         ],
//       },
//     ],
//     group: [
//       "Reference.id",
//       "Reference.name",
//       "Refs.id",
//       "Refs.Articles.id",
//       "Refs.Articles->Brand.id",
//       "Refs.Articles->Tag.id",
//     ],
//     order: [["id", "ASC"]],
//   });

//   const articles = result.map((item) => {
//     const brandsSet = new Set();
//     const tagsSet = new Set();
//     const refSet = new Set();

//     item.Refs.forEach((ref) => {
//       refSet.add(ref.name);
//       if (ref.Articles) {
//         ref.Articles.map((article) => {
//           brandsSet.add(article.Brand?.name);
//           tagsSet.add(article.Tag?.name);
//         });
//       }
//     });

//     return {
//       id: item.id,
//       name: item.name,
//       alert: item.alert,
//       refs: Array.from(refSet),
//       totalQuantity: item.Refs.reduce(
//         (acc, ref) =>
//           acc +
//           (ref.Articles
//             ? ref.Articles.reduce((sum, article) => sum + article.quantity, 0)
//             : 0),
//         0
//       ),
//       brands: Array.from(brandsSet),
//       tags: Array.from(tagsSet),
//     };
//   });
//   // sendRes(res, 200, { ReferenceIds });
//   sendRes(res, 200, {
//     doc_size: length,
//     pages: !!((length / limit) % 1)
//       ? Math.floor(length / limit) + 1
//       : length / limit,
//     currPage: +req.query.page || 1,

//     articles,
//   });
//   return next();
// });

// // MAX VALUE
// exports.maxValue = catchAsync(async (req, res, next) => {
//   const result = await db.Article.findAll({
//     limit: 1,
//     order: [["price", "DESC"]],
//   });

//   const maxValue = result.length > 0 ? result[0].price : null;

//   sendRes(res, 200, maxValue);
// });

// // FOR SORTIE
// exports.findDesigniation = reqHandler.forSortie(db.Article, getAllInclude);
// // GET NORMAL ARTICLE
// exports.getAllDesigniation = reqHandler.Find(db.Article, getAllInclude);
// exports.getExportArticles = reqHandler.ExportFile(
//   db.Article,
//   getAllInclude,
//   exportHeader
// );

// // reqHandler.Find(db.Article, );
// // GET ONE
// exports.getOneDesigniation = reqHandler.FindOne(db.Article, getOneInclude);

// // ADD DESIGNATION
// exports.addDesigniation = catchAsync(async (req, res, next) => {
//   const entree = await db.Entree.findOne({where :{id: req.body.EntreeId}})

//   if (entree.isValid || entree.isDFCValid) {
//       return next(new AppError(`We can't create new article in this entree`, 400));
//   }
//   // console.log(entree)
//   // console.log({ ...req.body, UserId: req.user.id });
//   const doc = await db.Article.create({
//     ...req.body,
//     date:req.body.date ?? entree.date,
//     initial_quantity: req.body.quantity,
//     UserId: req.user.id,
//     MagazinId: req.user.MagazinId,
//   });

//   sendRes(res, 200, doc);
//   return next();
// });

// // UPDATE DESIGNATION
// exports.updateDesigniation = catchAsync(async (req, res, next) => {
//   // console.log("00000000",req.body)
//   // FIND ARTICLE
//   const article = await db.Article.findOne({ where: { id: req.params.id } });

//   // console.log(article)
//   if (!article) {
//     return res.status(404).json({ message: "Article not found" });
//   }

//   const entree = await db.Entree.findOne({where :{id: article.EntreeId}})

//   if (entree.isValid || entree.isDFCValid) {
//       return next(new AppError(`We can't create new article in this entree`, 400));
//   }

//   // Get updated values from req.body
//   const { tax, price, quantity } = req.body;

//   // console.log(tax, price, article.initial_quantity, req.body, "===================");
//   let updatedData = {};

//   if (
//     // req.body.hasOwnProperty("tax") ||
//     // req.body.hasOwnProperty("price") ||
//     req.body.hasOwnProperty("quantity")
//   ) {
//     // Calculate updated values based on relationships
//     // const updatedTax = tax !== undefined && tax!==null && !isNaN(tax)  && tax !==article.tax ? tax : article.tax;
//     const updatedInitialQuantity =
//       quantity !== undefined && quantity !== 0 && !isNaN(quantity) && quantity!==null  ? quantity : article.initial_quantity;
//     // const updatedPrice =
//     //   price !== undefined && price !== 0  && !isNaN(price) && price!==null
//     //     ? price * (1 + updatedTax)
//     //     : (article.price / (1 + article.tax)) * (1 + updatedTax);

//     // console.log(updatedTax,updatedInitialQuantity,updatedPrice)
//     const updatedQuantity =
//       updatedInitialQuantity - article.initial_quantity + article.quantity;

//     // Update the article with the new values
//     updatedData = {
//       // tax: updatedTax,
//       // price: updatedPrice,
//       quantity: updatedQuantity,
//       initial_quantity: updatedInitialQuantity,
//     };
//   }

//   if (updatedData.quantity && updatedData.quantity < 0) {
//     return next(new AppError("impossible de mettre cette valeur", 400));
//   }

//   const data = filterObj(
//     req.body,
//     "UserId",
//     "createdAt",
//     "id",
//     "quantity",
//     "initial_quantity",
//     // "tax",
//     // "price"
//   );

//   const cleanedData = Object.fromEntries(
//     Object.entries(data).filter(([_, value]) => value !== null)
//   );

//   // console.log({ ...updatedData, ...cleanedData }, "[88888888888888888]");
//   // Update the article in the database
//   await db.Article.update(
//     { ...updatedData, ...cleanedData },
//     { where: { id: article.id } }
//   );

//   // Create article history for the changed values

//   for (const key in req.body) {
//     if (article[key] && { ...updatedData, ...data }[key] !== article[key]) {
//       const historyObj = {
//         data: key,
//         prevVal: JSON.stringify(article[key]).replace(/"/g, ""),
//         newVal: { ...updatedData, ...data }[key],
//         ArticleId: article.id,
//         UserId: req.user.id,
//       };
//       await db.ArticleHistory.create(historyObj);
//     }
//   }

//   req.body.EntreeId = article.EntreeId;
//   return next();
// });

// exports.deleteDesigniation = catchAsync(async (req, res, next) => {
//   const doc = await db.Article.findOne({ where: { id: req.params.id } });

//   if (!doc) {
//     return res.status(404).json({ message: "Article not found" });
//   }

//   const entree = await db.Entree.findOne({where :{id: doc.EntreeId}})

//   if (entree.isValid || entree.isDFCValid) {
//       return next(new AppError(`We can't create new article in this entree`, 400));
//   }

//   await db.Article.destroy({ where: { id: req.params.id } });
//   let obj = {
//     data: "deletedAt",
//     prevVal: null,
//     newVal: "has been deleted",
//     ArticleId: req.params.id,
//     UserId: req.user.id,
//   };
//   // console.log(obj);
//   await db.ArticleHistory.create(obj);

//   req.body.EntreeId = doc.EntreeId;
//   return next();
// });
