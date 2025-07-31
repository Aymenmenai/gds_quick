const { Op } = require("sequelize");
const db = require("../../models");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const filterObj = require("../utils/filterObj");
const excelJs = require("exceljs");
const sendRes = require("../utils/sendRes");
const reqHandler = require("./reqHandler");
const QueryBuilder = require("../utils/QueryBuilder");

exports.getYear = catchAsync(async (req, res, next) => {
  const currentYear = req.body.year || new Date().getFullYear();
  req.year = currentYear;
  next();
});

// COUNT ENTREE
exports.count = catchAsync(async (req, res, next) => {
  const startDate = new Date(req.year, 0, 1); // January 1st of the current year
  const endDate = new Date(req.year, 11, 31); //
  const Sortie = await db.Sortie.findOne({
    where: {
      date: {
        [Op.between]: [startDate, endDate],
      },
      MagazinId: req.user.MagazinId,
    },
    order: [["createdAt", "DESC"]],
    attributes: ["number", "id", "createdAt"],
  });
  // console.log(req.user.MagazinId,Sor/tie||1);
  sendRes(res, 200, Sortie?.number || 0);
});

// CREATE SORTIE
exports.addSortie = catchAsync(async (req, res, next) => {
  // console.log(req.body.MagazinId, req.user.MagazinId)
  const sortie = await db.Sortie.create({
    UserId: req.user.id,
    MagazinId: req.user.MagazinId,
    date: req.body.date,
    total_price: 0,
    number: req.body.number,
    BeneficiareId: req.body.BeneficiareId,
    VehiculeId: req.body.VehiculeId,
  });

  await db.SortieHistory.create({
    data: "createdAt",
    prevVal: null,
    newVal: null,
    SortieId: sortie.id,
    UserId: req.user.id,
  });

  // console.log(req.body.Articles.MagazinId,'sortie')
  for (let el in req.body.Articles) {
    const article = await db.Article.findOne({
      where: { id: req.body.Articles[el].id },
    });
    // if (article.quantity < req.body.Articles[el].currQuantity === false) {
    await db.Article.update(
      { quantity: article.quantity - req.body.Articles[el].currQuantity },
      { where: { id: req.body.Articles[el].id } }
    );

    await db.ArticleQuiSort.create({
      quantity: req.body.Articles[el].currQuantity,
      price: article.price,
      date: req.body.date,
      SortieId: sortie.id,
      ArticleId: req.body.Articles[el].id,
      UserId: req.user.id,
      MagazinId: req.body.Articles[el].MagazinId,
    });

    // }
  }

  // UPDATE SORTIE
  const total = await db.ArticleQuiSort.findAll({
    where: { SortieId: sortie.id },
    attributes: [[db.sequelize.literal("SUM(price * quantity)"), "result"]],
    raw: true,
  });

  sortie.total_price = total[0].result;
  await sortie.save();
  sendRes(res, 201, sortie.id);
});

// INCLUDE
const allSortieInclude = [
  {
    model: db.Beneficiare,
  },
  {
    model: db.Vehicule,
    include: [
      {
        model: db.VehiculeType,
        include: [{ model: db.Brand, attributes: ["id", "name"] }],
      },
      {
        model: db.VehiculeClient,
        attributes: ["name"],
        required: false, // Include vehicles even if they don't have a client
      },
    ],
  },
];
const getOneSortieInclude = [
  {
    model: db.Beneficiare,
    attributes: ["name"],
  },
  {
    model: db.Vehicule,
    attributes: ["name", "matricule"],
    include: [
      {
        model: db.VehiculeType,
        attributes: ["id", "name"],
        include: [{ model: db.Brand, attributes: ["id", "name"] }],
      },
      {
        model: db.VehiculeClient,
        attributes: ["name"],
        required: false, // Include vehicles even if they don't have a client
      },
    ],
  },
  {
    model: db.ArticleQuiSort,
    // attributes: ["id", "quantity", "price", "date", "ArticleId"],
    include: [
      {
        model: db.Article,
        include: [
          {
            model: db.Entree,
            attributes: ["number"],
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
    ],
  },
];

exports.getAllSortie = async (req, res, next) => {
  try {
    const queryBuilder = new QueryBuilder(req.query);
    const { result } = queryBuilder
      .buildSorting()
      .buildFilter()
      .buildAttributes();

    // Default sort: latest date first, then by number
    result.order = [
      ["date", "DESC"],
      ["number", "DESC"],
    ];

    const adjustedQuery = {
      ...result,
      where: {
        ...result.where,
        MagazinId: req.user.MagazinId,
      },
    };

    const processIncludes = (includes) => {
      return includes.map((inc) => {
        if (inc.nested) {
          inc.include = processIncludes(inc.include || []);
        }
        if (req.query[`${inc.as}.name`]) {
          inc.where = {
            ...inc.where,
            name: { [Op.iRegexp]: req.query[`${inc.as}.name`] },
          };
        }
        return inc;
      });
    };

    const processedIncludes = processIncludes(allSortieInclude);

    const documents = await db.Sortie.findAll({
      include: processedIncludes,
      ...adjustedQuery,
      required: true,
      duplicating: false,
    });

    const { limit, offset, page, ...baseQuery } = adjustedQuery;
    const allDocuments = await db.Sortie.findAll({
      include: processedIncludes,
      ...baseQuery,
    });

    const totalRecords = allDocuments.length;

    if (totalRecords === 0) {
      sendRes(res, 200, {
        doc_size: 0,
        pages: 1,
        currPage: 1,
        data: [],
      });
      return next();
    }

    const totalPages = Math.ceil(totalRecords / (limit || totalRecords));

    sendRes(res, 200, {
      doc_size: totalRecords,
      pages: totalPages,
      currPage: +req.query.page || 1,
      data: documents,
    });

    return next();
  } catch (error) {
    console.error("Error in getAllSortie:", error);
    return next(error);
  }
};

exports.getOneSortie = reqHandler.FindOne(db.Sortie, getOneSortieInclude);
exports.updateSortie = async (req, res, next) => {
  try {
    // console.log(req.body)
    const filteredData = Object.fromEntries(
      Object.entries(req.body).filter(([_, value]) => value !== null)
    );

    // GET ELEMENT
    const old = await db.Sortie.findOne({ where: { id: req.params.id } });
    if (!old) {
      return next(new AppError(`Sortie not found`, 404));
    }

    // CHECK VALIDATION FIELDS
    if (old.isValid || old.isDFCValid) {
      return next(new AppError(`Sortie cannot be updated`, 400));
    }

    // GET UPDATED ELEMENT
    const data = filterObj(
      filteredData,
      "UserId",
      "createdAt",
      "id",
      "total_price"
    );

    // UPDATE THE RECORD
    const [updated] = await db.Sortie.update(data, {
      where: { id: req.params.id },
    });
    // console.log(updated)

    if (!updated) {
      return next(new AppError(`Failed to update sortie`, 400));
    }

    // MAKE HISTORY RECORD
    for (let i in data) {
      if (i in old) {
        let obj = {
          data: i,
          prevVal: JSON.stringify(old[i]).replace(/"/g, ""),
          newVal: req.body[i],
          SortieId: old.id,
          UserId: req.user.id,
        };
        if (
          obj.data !== "updatedAt" &&
          `${obj.prevVal}` !== `${obj.newVal}` &&
          `${obj.prevVal}`.split("T")[0] !== `${obj.newVal}`
        ) {
          await db.SortieHistory.create(obj);
        }
      }
    }

    sendRes(res, 200);
    return next();
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

exports.deleteSortie = catchAsync(async (req, res, next) => {
  const old = await db.Sortie.findOne({ where: { id: req.params.id } });

  if (!old) {
    return next(new AppError(`This document doesn't exist`, 404));
  }

  if (old.isValid || old.isDFCValid) {
    return next(new AppError(`Sortie cannot be deleted`, 400));
  }

  // DELETE
  const doc = await db.Sortie.destroy({ where: { id: req.params.id } });
  if (!doc) {
    return next(new AppError(`This document doesn't exist`, 404));
  }
  // DELETE ENTREE HISTORY
  let obj = {
    data: "deletedAt",
    prevVal: null,
    newVal: "has been deleted",
    SortieId: req.params.id,
    UserId: req.user.id,
  };
  // console.log(obj);
  // console.log(obj);
  await db.SortieHistory.create(obj);
  // GET QUANTITY
  const aqs = await db.ArticleQuiSort.findAll({
    where: { SortieId: req.params.id },
    attributes: ["ArticleId", "quantity"],
  });
  // ADD THE QUANTITY TO THE ARTICLE
  for (let a in aqs) {
    const article = await db.Article.findOne({
      where: { id: aqs[a].ArticleId },
    });
    mainQuantity = article.quantity + aqs[a].quantity;
    article.quantity = mainQuantity;
    await article.save();
  }
  // DELETEL RELATION ARTICLE
  await db.ArticleQuiSort.destroy({
    where: { SortieId: req.params.id },
  });

  sendRes(res, 200, doc);
  return next();
});

// EPXORT ENTREE
exports.exportSortie = catchAsync(async (req, res, next) => {
  const data = await db.Sortie.findOne({
    where: { id: req.params.id },
    attributes: ["number", "total_price", "VehiculeId", "BeneficiareId"],
    include: getOneSortieInclude,
  });

  // console.log(req.body,'<HHHHHHHHHHHHHH>');
  let workbook = new excelJs.Workbook();
  let sheet = workbook.addWorksheet("sheet");
  // INFORMATION ROW
  sheet.addRow(["LA DATE", data.date]);
  sheet.addRow(["BON DE SORTIE N˚", data.number]);
  sheet.addRow(["BENEFICIARE", data.Beneficiare.name]);
  sheet.addRow(["ENGIN", `${data.Vehicule.name}(${data.Vehicule.matricule})`]);
  sheet.addRow([]); // Blank row for spacing
  sheet.addRow([
    "N°",
    "Référence",
    "Désignation",
    "Qte",
    "Prix U HT",
    "Montatnt HT",
  ]);

  // CALCULATIR
  data.ArticleQuiSorts.map((item, index) => {
    const totalPrice = item.price * item.quantity;
    sheet.addRow([
      index + 1,
      item.Article.Ref.name,
      item.Article.name,
      item.quantity,
      item.price,
      totalPrice,
    ]);
  });

  // Calculate the total of all "Total Price" values
  const totalAmountCell = sheet.getCell(`E${sheet.rowCount + 1}`);
  totalAmountCell.value = data.total_price;
  sheet.getRow(sheet.rowCount).getCell(1).value = "Total Amount";

  // // console.log(length, query.limit, "[AGAIN LENGTH AND QUERY]");
  // console.log(sheet.getRow(1), sheet.getRows());
  // console.log("HELLO", sheet.rowCount, data.length);
  const filename = `sortie-${data.number}-${
    new Date().toISOString().split("T")[0]
  }.xlsx`;

  // // Set headers and send the workbook as a buffer
  // // console.log("hh");
  res.attachment(filename);
  res.status(200).send(await workbook.xlsx.writeBuffer());
  // sendRes(res, 200, data)
});
