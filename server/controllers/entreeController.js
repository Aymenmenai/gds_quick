const { Op } = require("sequelize");
const db = require("../../models");
const catchAsync = require("../utils/catchAsync");
const sendRes = require("../utils/sendRes");
const excelJs = require("exceljs");
const reqHandler = require("./reqHandler");
const filterObj = require("../utils/filterObj");
const AppError = require("../utils/appError");
const QueryBuilder = require("../utils/QueryBuilder");
// const { includes } = require("lodash");

// CALCULATE NEW PRICE
exports.calculatePrice = catchAsync(async (req, res, next) => {
  if (req.body.EntreeId) {
    const Entree = await db.Entree.findOne({
      where: { id: req.body.EntreeId },
    });

    // console.log("INSIDE PRICE", Entree);
    const total = await db.Article.findAll({
      where: { EntreeId: Entree.id },
      attributes: [
        [db.sequelize.literal("SUM(price * initial_quantity)"), "result"],
      ],
      raw: true,
    });

    // console.log("TOTALPRICE", total);
    Entree.total_price = total[0].result || 0;
    await Entree.save();
  }
  sendRes(res, 200, "success");
  req.body.EntreeId = undefined;
  return next();
});

exports.getYear = catchAsync(async (req, res, next) => {
  const currentYear = req.body.year || new Date().getFullYear();
  req.year = currentYear;
  next();
});

// COUNT ENTREE
exports.count = catchAsync(async (req, res, next) => {
  // console.log(req.year);
  // Define the start and end dates for the range
  const startDate = new Date(req.year, 0, 1); // January 1st of the current year
  const endDate = new Date(req.year, 11, 31); //
  // console.log(startDate, endDate,req.user);
  const Entree = await db.Entree.findOne({
    where: {
      date: {
        [Op.between]: [startDate, endDate],
      },
      MagazinId: req.user.MagazinId,
    },
    order: [["createdAt", "DESC"]],
    attributes: ["number", "id", "createdAt"],
  });
  // console.log(Entree);
  sendRes(res, 200, Entree?.number || 0);
});

// MAIN OPERATION
exports.addEntree = async (req, res, next) => {
  try {
    const { date, number, facture, bon_de_livraison, FournisseurId } = req.body;
    // CREATE AN ENTREE
    // console.log(req.body.name, req.user.id);
    const Entree = await db.Entree.create({
      date,
      number,
      facture,
      total_price: 0,
      bon_de_livraison,
      UserId: req.user.id,
      MagazinId: req.user.MagazinId,
      FournisseurId,
    });

    await db.EntreeHistory.create({
      data: "createdAt",
      prevVal: null,
      newVal: null,
      EntreeId: Entree.id,
      UserId: req.user.id,
    });

    let total = 0;

    if (req.body.Articles) {
      for (let el in req.body.Articles) {
        total =
          total +
          req.body.Articles[el].quantity *
            req.body.Articles[el].price *
            (1 + (req.body.Articles[el].tax || 0));

        //   CREATE AN ARTICLE
        const Article = await db.Article.create({
          // ASSOCIATION
          RefId: req.body.Articles[el].RefId,
          UnitId: req.body.Articles[el].UnitId,
          SousFamilyId: req.body.Articles[el].SousFamilyId,
          TagId: req.body.Articles[el].TagId,
          BrandId: req.body.Articles[el].BrandId,
          MagazinId: req.user.MagazinId,
          EntreeId: Entree.id,
          UserId: req.user.id,
          // INPUT
          name: req.body.Articles[el].name,
          initial_quantity: +req.body.Articles[el].quantity,
          quantity: +req.body.Articles[el].quantity,
          price: +req.body.Articles[el].price,
          place: req.body.Articles[el].place || "",
          date: req.body.Articles[el].date,
          tax: req.body.Articles[el].tax || 0,
        });

        if (req.body.Articles[el].Attributes) {
          // CRETE AN ATT
          for (let e in req.body.Articles[el].Attributes) {
            await db.Attribute.create({
              name: req.body.Articles[el].Attributes[e].name,
              value: req.body.Articles[el].Attributes[e].value,
              UserId: req.user.id,
              ArticleId: Article.id,
            });
          }
        }
        if (req.body.Articles[el].ExpiredDay) {
          await db.ExpiredDay.create({
            ExpiredDay: req.body.Articles[el].ExpiredDay,
            ArticleId: Article.id,
            MagazinId: req.user.MagazinId,
            UserId: req.user.id,
          });
        }
      }
    }

    Entree.total_price = total;
    await Entree.save();
    sendRes(res, 201, Entree.id);
  } catch (err) {
    console.log(err);
  }
};

// INCLUDE
// const allEntreeInclude = [
//   { model: db.Fournisseur, attributes: ["name", "id"] },
//   {
//     model: db.Article,
//     attributes: ["id",],
//   },
// ];
const EntreeInclude = [
  { model: db.Fournisseur, attributes: ["id", "name"] },
  {
    model: db.Article,
    include: [
      { model: db.Attribute, attributes: ["id", "name", "value"] },
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
];

// REQUEST
exports.getAllEntree = async (req, res, next) => {
  try {
    const queryBuilder = new QueryBuilder(req.query);
    const { result } = queryBuilder
      .buildSorting()
      .buildFilter()
      .buildAttributes();

    result.order = [
      ["date", "DESC"],
      ["number", "DESC"],
    ];

    const adjustedQuery = {
      ...result,
      where: {
        ...result.where,
        number: {
          [Op.gt]: 0,
        },
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

    const processedIncludes = processIncludes(EntreeInclude);

    const documents = await db.Entree.findAll({
      include: processedIncludes,
      ...adjustedQuery,
      required: true,
      duplicating: false,
    });

    const { limit, offset, page, ...baseQuery } = adjustedQuery;
    const allDocuments = await db.Entree.findAll({
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
    console.error("Error in getAllEntree:", error);
    return next(error);
  }
};
exports.getMaxMinValue = reqHandler.GetMaxMin(db.Entree);
exports.getOneEntree = reqHandler.FindOne(db.Entree, EntreeInclude);
exports.updateEntree = async (req, res, next) => {
  try {
    const filteredData = Object.fromEntries(
      Object.entries(req.body).filter(([_, value]) => value !== null)
    );

    // console.log(filteredData, 'Filtered Data');

    // GET ELEMENT
    const old = await db.Entree.findOne({ where: { id: req.params.id } });
    if (!old) {
      return next(new AppError(`Entree not found`, 404));
    }

    // CHECK VALIDATION FIELDS
    if (old.isValid || old.isDFCValid) {
      return next(new AppError(`Entree cannot be updated`, 400));
    }

    // GET UPDATED ELEMENT
    const data = filterObj(
      filteredData,
      "UserId",
      "createdAt",
      "id",
      "total_price"
    );

    // console.log(data);
    // UPDATE THE RECORD
    const [updated] = await db.Entree.update(data, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return next(new AppError(`Failed to update entree`, 400));
    }

    // MAKE HISTORY RECORD
    for (let i in data) {
      if (i in old) {
        let obj = {
          data: i,
          prevVal: JSON.stringify(old[i]).replace(/"/g, ""),
          newVal: req.body[i],
          EntreeId: old.id,
          UserId: req.user.id,
        };
        if (
          obj.data !== "updatedAt" &&
          `${obj.prevVal}` !== `${obj.newVal}` &&
          `${obj.prevVal}`.split("T")[0] !== `${obj.newVal}`
        ) {
          await db.EntreeHistory.create(obj);
        }
      }
    }

    sendRes(res, 200);
    return next();
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

// DELETE ENTREE WITH ARTICLES
exports.deleteEntree = catchAsync(async (req, res, next) => {
  // console.log(req.params.id);
  const old = await db.Entree.findOne({ where: { id: req.params.id } });
  if (!old) {
    return next(new AppError(`This document doesn't exist`, 404));
  }

  if (old.isValid || old.isDFCValid) {
    return next(new AppError(`Entree cannot be deleted`, 400));
  }
  // DELETE
  const doc = await db.Entree.destroy({ where: { id: req.params.id } });

  // DELETE ENTREE HISTORY
  let obj = {
    data: "deletedAt",
    prevVal: null,
    newVal: "has been deleted",
    EntreeId: req.params.id,
    UserId: req.user.id,
  };
  // console.log(obj);
  // console.log(obj);
  await db.EntreeHistory.create(obj);
  // DELETEL RELATION ARTICLE
  const articles = await db.Article.findAll({
    where: { EntreeId: req.params.id },
  });
  for (let a in articles) {
    // GET ARTICLEQS
    const aqs = await db.ArticleQuiSort.findAll({
      where: { ArticleId: articles[a].id },
      include: [{ model: db.Sortie, attributes: ["id"] }],
    });
    // DESTORY
    await db.ArticleQuiSort.destroy({ where: { ArticleId: articles[a].id } });

    for (let i in aqs) {
      const total = await db.ArticleQuiSort.findAll({
        where: { SortieId: aqs[i].Sortie.id },
        attributes: [[db.sequelize.literal("SUM(price * quantity)"), "result"]],
        raw: true,
      });

      // console.log("TOTALPRICE", total);
      await db.Sortie.update(
        { total_price: total[0].result || 0 },
        { where: { id: aqs[i].Sortie.id } }
      );
    }
  }
  await db.Article.destroy({ where: { EntreeId: req.params.id } });

  sendRes(res, 200, doc);
  return next();
});

// EPXORT ENTREE
exports.exportEntree = catchAsync(async (req, res, next) => {
  const data = await db.Entree.findOne({
    where: { id: req.params.id },
    attributes: [
      "number",
      "bon_de_livraison",
      "total_price",
      "facture",
      "date",
      "FournisseurId",
    ],
    include: [
      { model: db.Fournisseur, attributes: ["id", "name"] },
      {
        model: db.Article,
        attributes: ["name", "price", "initial_quantity", "RefId", "UnitId"],
        include: [
          {
            model: db.Ref,
            attributes: ["name"],
          },
          {
            model: db.Unit,
            attributes: ["name"],
          },
        ],
      },
    ],
  });

  // console.log(req.body,'<HHHHHHHHHHHHHH>');
  let workbook = new excelJs.Workbook();
  let sheet = workbook.addWorksheet("sheet");
  // INFORMATION ROW
  sheet.addRow(["LA DATE", data.date]);
  sheet.addRow(["BON D'ENTREE N˚", data.number]);
  sheet.addRow(["FOURNISSEUR", data.Fournisseur.name]);
  sheet.addRow(["BON DE LIVRAISON N°", data.bon_de_livraison]);
  sheet.addRow(["FACTURE N˚", data.facture]);
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
  data.Articles.map((item, index) => {
    const totalPrice = item.price * item.initial_quantity;
    sheet.addRow([
      index + 1,
      item.Ref.name,
      item.name,
      item.initial_quantity,
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
  const filename = `entree-${data.number}-${
    new Date().toISOString().split("T")[0]
  }.xlsx`;

  // // Set headers and send the workbook as a buffer
  // // console.log("hh");
  res.attachment(filename);
  res.status(200).send(await workbook.xlsx.writeBuffer());
  // sendRes(res, 200, data)
});
