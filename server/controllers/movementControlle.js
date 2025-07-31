// EXPORTING
const excelJs = require("exceljs");
const db = require("../../models");
const { Op } = require("sequelize");
const sendRes = require("../utils/sendRes");
const catchAsync = require("../utils/catchAsync");
const QueryBuilder = require("../utils/QueryBuilder");

// ------------------------------------------------------------------------------------------------------------------------
function parseQueryToWhere(query, options = {}) {
  const prefix = options.prefix || "Article";
  const operator = options.operator || Op.iRegexp;
  const ignoreKeys = ["sort", "page", "limit", "offset"];

  const where = {};

  for (const key in query) {
    if (ignoreKeys.includes(key)) continue;

    const value = query[key];
    if (value === undefined || value === null || value === "") continue;
    if (key !== "date") {
      // e.g., 'Ref.name' -> '$Article.Ref.name$'
      const qualifiedKey = `$${prefix}.${key}$`;
      where[qualifiedKey] = { [operator]: value };
    } else {
      where.date = value;
    }
  }

  return where;
}

// function prefixWhereClauseKeys(where, prefix) {
//   if (!where || typeof where !== 'object') return where;

//   const result = Array.isArray(where) ? [] : {};

//   for (const key in where) {
//     const value = where[key];

//     // Recursively handle nested objects
//     const newValue = (typeof value === 'object' && value !== null)
//       ? prefixWhereClauseKeys(value, prefix)
//       : value;

//     // Skip keys with invalid empty object values
//     const isEmptyObject = typeof newValue === 'object' && newValue !== null && Object.keys(newValue).length === 0;
//     if (isEmptyObject) continue;

//     let newKey = key;

//     // Detect dot notation like $Ref.name$ and prefix it
//     if (typeof key === 'string' && key.startsWith('$') && key.endsWith('$') && key.includes('.')) {
//       const inner = key.slice(1, -1); // Ref.name
//       if (!inner.startsWith(prefix + '.')) {
//         newKey = `$${prefix}.${inner}$`;
//       }
//     }

//     result[newKey] = newValue;
//   }

//   return result;
// }

// ------------------------------------------------------------------------------------------------------------------------

const articleInclude = [
  {
    model: db.Entree,
    attributes: ["number", "id"],
    include: [{ model: db.Fournisseur, attributes: ["name", "id"] }],
  },
  {
    model: db.Ref,
    attributes: ["name", "ReferenceId"],
    include: [{ model: db.Reference, attributes: ["id", "alert"] }],
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

const articleSortant = [
  {
    model: db.Article,
    attributes: ["id", "name"],
    required: false,
    include: [
      //   {
      //     model: db.Entree,
      //     attributes: ["id", "number"],
      //     include: [{ model: db.Fournisseur, attributes: ["name", "id"] }],
      //   },
      {
        model: db.Ref,
        attributes: ["name", "ReferenceId"],
        include: [{ model: db.Reference, attributes: ["id"] }],
        required: false,
      },
    ],
  },
  {
    model: db.Sortie,
    attributes: ["id", "number"],
    include: [
      { model: db.Beneficiare, attributes: ["name", "id"] },
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
    ],
  },
];

//  ENTREE / SORTIE
exports.getEntreeSortie = catchAsync(async (req, res, next) => {
  // Get the current year or custom date range from the request body
  const currentYear = req.body.year || new Date().getFullYear();
  const startDate = !!req.query.date
    ? req.query.date.gte
    : req.body.startDate
    ? new Date(req.body.startDate)
    : new Date(currentYear, 0, 1);
  const endDate = !!req.query.date
    ? req.query.date.lte
    : req.body.endDate
    ? new Date(req.body.endDate)
    : new Date(currentYear, 11, 31);

  // console.log(req.body, req.query, req.params)
  // Pagination parameters
  const page = +req.query.page || 1; // Default to page 1 if not provided
  const limit = parseInt(14, 10) || 10; // Default to 10 items per page if not provided
  const offset = (page - 1) * limit;

  // Query the Entree records
  const entrees = await db.Entree.findAll({
    where: {
      date: {
        [Op.between]: [startDate, endDate],
      },
      MagazinId: req.user.MagazinId,
    },
    include: [{ model: db.User, attributes: ["name"] }],
    attributes: ["number", "id", "date", "total_price", "UserId"],
    order: [["date", "DESC"]], // Sorting by date descending
  });

  // Add + sign to Entree total price
  const formattedEntrees = entrees.map((entree) => ({
    p: "+" + entree.total_price,
    sign: "sign++",
    date: entree.date,
    type: "Entree numero " + entree.number,
    user: entree.User.name,
  }));

  // Query the Sortie records
  const sorties = await db.Sortie.findAll({
    where: {
      date: {
        [Op.between]: [startDate, endDate],
      },
      MagazinId: req.user.MagazinId,
    },
    include: [{ model: db.User, attributes: ["name"] }],
    attributes: ["number", "id", "date", "total_price", "UserId"],
    order: [["date", "DESC"]], // Sorting by date descending
  });

  // Add - sign to Sortie total price
  const formattedSorties = sorties.map((sortie) => ({
    p: "-" + sortie.total_price,
    sign: "sign--",
    date: sortie.date,
    type: "Sortie numero " + sortie.number,
    user: sortie.User.name,
  }));

  // Combine Entree and Sortie into one array and sort by date in descending order (newest to oldest)
  const combinedEntries = [...formattedEntrees, ...formattedSorties].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Apply pagination to the combined array
  const paginatedCombinedEntries = combinedEntries.slice(
    offset,
    offset + limit
  );

  // Send the paginated response
  sendRes(res, 200, {
    currPage: page,
    pages: Math.ceil(combinedEntries.length / limit),
    doc_size: combinedEntries.length,
    data: paginatedCombinedEntries,
  });
});
//  MOVEMENT
exports.getArticleAndArticleQuiSort = catchAsync(async (req, res, next) => {
  const queryBuilder = new QueryBuilder(req.query);
  const q = queryBuilder.buildSorting().buildFilter().buildAttributes();
  //   console.log(q)
  const { page: p, limit: l, offset: o, ...result } = q.result;

  const page = +req.query.page || 1; // Default to page 1 if not provided
  const limit = parseInt(14, 10) || 10; // Default to 10 items per page if not provided
  const offset = (page - 1) * limit;

  const articles = await db.Article.findAll({
    ...result,
    where: { MagazinId: req.user.MagazinId, ...result.where },
    include: articleInclude,
  });

  result.where = parseQueryToWhere(req.query);

  // Add positive sign to Article numbers
  const formattedArticles = articles.map((article) => ({
    sign: "sign++",
    reference: article.Ref?.name,
    name: article.name,
    quantity: "+" + article.initial_quantity,
    date: article.date,
    Fournisseur: article.Entree?.Fournisseur?.name || "",
  }));

  const articlesQuiSort = await db.ArticleQuiSort.findAll({
    // ...result,
    where: { MagazinId: req.user.MagazinId, ...result.where },
    include: articleSortant,
  });

  const formattedArticlesQuiSort = articlesQuiSort.map((articleQuiSort) => {
    const article = articleQuiSort.Article || {};
    const ref = article.Ref || {};

    return {
      sign: "sign--",
      reference: ref.name || "/",
      name: article.name || "/",
      quantity: "-" + articleQuiSort.quantity,
      date: articleQuiSort.date,
      Fournisseur: "/",
      Beneficiare: articleQuiSort.Sortie?.Beneficiare?.name || "",
    };
  });

  const combinedArticles = [
    ...formattedArticles,
    ...formattedArticlesQuiSort,
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const paginatedCombinedArticles = combinedArticles.slice(
    offset,
    offset + limit
  );

  sendRes(res, 200, {
    currPage: page,
    pages: Math.floor(combinedArticles.length / limit) + 1,
    doc_size: combinedArticles.length,
    data: paginatedCombinedArticles,
  });
});

// Export to Excel helper function
const exportToExcel = async (res, filename, headers, data) => {
  let workbook = new excelJs.Workbook();
  let sheet = workbook.addWorksheet("Sheet");

  // Set up headers
  sheet.columns = headers;

  // Populate rows
  for (let i = 0; i < data.length; i++) {
    let rowObj = {};
    sheet.columns.forEach((col) => {
      rowObj[col.header] = `${col.key}`.includes(".")
        ? col.key.split(".").reduce((acc, key) => acc[key] || "/", data[i])
        : data[i][col.key];
    });
    sheet.addRow(Object.values(rowObj));
  }

  // Set response headers and send the workbook as a buffer
  res.attachment(filename);
  res.status(200).send(await workbook.xlsx.writeBuffer());
};

// Export EntreeSortie to Excel
exports.exportEntreeSortie = async (req, res, next) => {
  try {
    // console.log(req.query, 'heire is params')
    // Fetch data using getEntreeSortie logic (without pagination)
    const currentYear = req.body.year || new Date().getFullYear();
    const startDate = !!req.query?.date?.gte
      ? new Date(req.query.date.gte)
      : new Date(currentYear, 0, 1);
    const endDate = !!req.query?.date?.lte
      ? new Date(req.query.date.lte)
      : new Date(currentYear, 11, 31);

    const entrees = await db.Entree.findAll({
      where: {
        date: { [Op.between]: [startDate, endDate] },
        MagazinId: req.user.MagazinId,
      },
      include: [{ model: db.User, attributes: ["name"] }],
      attributes: ["number", "id", "date", "total_price", "UserId"],
    });

    const formattedEntrees = entrees.map((entree) => ({
      p: "+" + entree.total_price,
      sign: "sign++",
      date: entree.date,
      type: "ENTREE: N°" + entree.number,
      user: entree.User.name,
    }));

    const sorties = await db.Sortie.findAll({
      where: {
        date: { [Op.between]: [startDate, endDate] },
        MagazinId: req.user.MagazinId,
      },
      include: [{ model: db.User, attributes: ["name"] }],
      attributes: ["number", "id", "date", "total_price", "UserId"],
    });

    const formattedSorties = sorties.map((sortie) => ({
      p: "-" + sortie.total_price,
      sign: "sign--",
      date: sortie.date,
      type: "SORTIE: N°" + sortie.number,
      user: sortie.User.name,
    }));

    // Combine and sort by date
    const combinedEntries = [...formattedEntrees, ...formattedSorties].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Define headers
    const headers = [
      { header: "Date", key: "date", width: 20 },
      { header: "Type", key: "type", width: 30 },
      { header: "User", key: "user", width: 25 },
      { header: "Price", key: "p", width: 15 },
      { header: "Sign", key: "sign", width: 10 },
    ];

    await exportToExcel(
      res,
      `EntreeSortie-${new Date().toISOString().split("T")[0]}.xlsx`,
      headers,
      combinedEntries
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export ArticleAndArticleQuiSort to Excel
exports.exportArticleAndArticleQuiSort = async (req, res, next) => {
  try {
    const queryBuilder = new QueryBuilder(req.query);
    const q = queryBuilder.buildSorting().buildFilter().buildAttributes();
    //   console.log(q)
    const { page: p, limit: l, offset: o, ...result } = q.result;

    const articles = await db.Article.findAll({
      ...result,
      where: { MagazinId: req.user.MagazinId, ...result.where },
      include: articleInclude,
    });

    result.where = parseQueryToWhere(req.query);

    // Add positive sign to Article numbers
    const formattedArticles = articles.map((article) => ({
      sign: "sign++",
      reference: article.Ref?.name,
      name: article.name,
      quantity: "+" + article.initial_quantity,
      date: article.date,
      Fournisseur: article.Entree?.Fournisseur?.name || "",
      Beneficiare: "/",
    }));

    const articlesQuiSort = await db.ArticleQuiSort.findAll({
      // ...result,
      where: { MagazinId: req.user.MagazinId, ...result.where },
      include: articleSortant,
    });

    const formattedArticlesQuiSort = articlesQuiSort.map((articleQuiSort) => {
      const article = articleQuiSort.Article || {};
      const ref = article.Ref || {};

      return {
        sign: "sign--",
        reference: ref.name || "/",
        name: article.name || "/",
        quantity: "-" + articleQuiSort.quantity,
        date: articleQuiSort.date,
        Fournisseur: "/",
        Beneficiare: articleQuiSort.Sortie?.Beneficiare?.name || "",
      };
    });

    const combinedArticles = [
      ...formattedArticles,
      ...formattedArticlesQuiSort,
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Define headers
    const headers = [
      { header: "Date", key: "date", width: 20 },
      { header: "Reference", key: "reference", width: 25 },
      { header: "Designation", key: "name", width: 30 },
      { header: "Quantity", key: "quantity", width: 15 },
      { header: "Beneficiare", key: "Beneficiare", width: 20 },
      { header: "Fournisseur", key: "Fournisseur", width: 20 },
    ];

    await exportToExcel(
      res,
      `ArticleAndArticleQuiSort-${new Date().toISOString().split("T")[0]}.xlsx`,
      headers,
      combinedArticles
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
