const excelJs = require("exceljs");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sendRes = require("../utils/sendRes");
var stream = require("stream");
const filterObj = require("../utils/filterObj");
const { Op, Sequelize } = require("sequelize");
const db = require("../../models");
const QueryBuilder = require("../utils/QueryBuilder");

//
exports.forSortie = (Model, include) =>
  catchAsync(async (req, res, next) => {
    // console.log(query)\
    let queryObj = { ...req.query };
    const excludedFields = ["page", "limit", "sort", "fields"];
    let where = {};
    excludedFields.forEach((el) => delete queryObj[el]);

    Object.keys(queryObj).map((key) => {
      let field = key;
      let value = queryObj[key];
      let parts = key.split(".");
      if (parts.length > 1) {
        field = `$${parts.join(".")}$`;
      }

      if (typeof value === "object") {
        where[field] = {};
        Object.keys(value).forEach((op) => {
          let val = value[op];
          if (val.includes(",")) {
            val = val.split(",");
          }
          where[field][Op[op]] = val;
        });
      } else {
        if (value.includes(",")) {
          value = value.split(",");
        }
        where[field] = value;
      }
    });

    const doc = await Model.findAll({
      required: true,
      duplicating: false,
      include,
      where,
    });

    sendRes(res, 200, doc);
    return next();
  });

// MAJORTY
exports.Options = (Model) =>
  catchAsync(async (req, res, next) => {
    const queryBuilder = new QueryBuilder(req.query);
    const { result } = queryBuilder
      .buildSorting()
      .buildFilter()
      .buildAttributes();
    const { limit, offset, page, ...restQuery } = result;

    // console.log(result);
    const doc = await Model.findAll({
      ...result,
      required: true,
      duplicating: false,
    });

    sendRes(res, 200, doc);
    return next();
  });

// FIND ALL DOCUMENTS
exports.Find =
  (Model, include = [], useMagazinFilter = true) =>
  async (req, res, next) => {
    try {
      // Build the query using QueryBuilder utility.
      const queryBuilder = new QueryBuilder(req.query);
      const { result } = queryBuilder
        .buildSorting()
        .buildFilter()
        .buildAttributes();

      // console.log(result)
      // Customize the query based on the model type.
      const adjustedQuery =
        Model.name === "Entree"
          ? {
              ...result,
              where: {
                ...result.where,
                number: {
                  [Op.gt]: 0, // Ensures "number" is greater than zero.
                },
              },
            }
          : result;

      // Add MagazinId filter if required.
      adjustedQuery.where = useMagazinFilter
        ? { ...adjustedQuery.where, MagazinId: req.user.MagazinId }
        : adjustedQuery.where;

      // Dynamically apply filters to nested includes.
      const processIncludes = (includes) => {
        return includes.map((inc) => {
          if (inc.nested) {
            // Recursively process nested includes.
            inc.include = processIncludes(inc.include || []);
          }
          // Handle nested table filters dynamically using $field$ syntax.
          if (req.query[`${inc.as}.name`]) {
            inc.where = {
              ...inc.where,
              name: { [Op.iRegexp]: req.query[`${inc.as}.name`] },
            };
          }
          return inc;
        });
      };

      const processedIncludes = processIncludes(include);

      // Fetch filtered documents with dynamic includes.
      const documents = await Model.findAll({
        include: processedIncludes,
        ...adjustedQuery,
        required: true,
        duplicating: false,
      });

      // Separate pagination logic and fetch all matching documents for total count.
      const { limit, offset, page, ...baseQuery } = adjustedQuery;
      const allDocuments = await Model.findAll({
        include: processedIncludes,
        ...baseQuery,
      });

      const totalRecords = allDocuments.length;

      // Handle empty results.
      if (totalRecords === 0) {
        sendRes(res, 200, {
          doc_size: 0,
          pages: 1,
          currPage: 1,
          data: [],
        });
        return next();
      }

      // Calculate total pages.
      const totalPages = Math.ceil(totalRecords / (limit || totalRecords));

      // Send the paginated response.
      sendRes(res, 200, {
        doc_size: totalRecords,
        pages: totalPages,
        currPage: +req.query.page || 1,
        data: documents,
      });

      return next();
    } catch (error) {
      console.error("Error in Find function:", error);
      return next(error);
    }
  };

// FIND ONE DOCUMENT
exports.FindOne = (Model, include = []) =>
  catchAsync(async (req, res, next) => {
    // console.log("HELLOW");
    // console.log(req.params.id, "dsjfhdfuhgsis");
    const doc = await Model.findOne({
      where: { id: req.params.id },
      include,
    });
    // console.log(doc);

    if (!doc) {
      return next(new AppError(`There is no  with this ID `, 404));
    }
    sendRes(res, 200, doc);
    return next();
  });

// UPDATE ONE DOCUMENT
exports.UpdateOne = (Model, ModelHistory, nameId) => async (req, res, next) => {
  try {
    const filteredData = Object.fromEntries(
      Object.entries(req.body).filter(([_, value]) => value !== null)
    );

    // console.log(filteredData,'dsfjosdihfisdugfysdgfusdyg')
    // console.log(req.body,req.params.id)
    // GET ELEMENT
    const old = await Model.findOne({ where: { id: req.params.id } });
    // GET UPDATED ELEMENT
    const data = filterObj(
      filteredData,
      "UserId",
      "createdAt",
      "id",
      "total_price"
    );
    // console.log(data)
    const doc = await Model.update(data, { where: { id: req.params.id } });
    // MAKE IT IN HISTORY
    // console.log("[WE ARE HERE ==========]");

    // IMPORT FOR HISTORY -------- NAMEID,MODELHISTORY,
    // const nameId = "BrandId";
    // const ModelHistory = db.BrandHistory
    for (let i in data) {
      // console.log(i in old);
      if (i in old) {
        let obj = {
          data: i,
          prevVal: JSON.stringify(old[i]).replace(/"/g, ""),
          newVal: req.body[i],
          [nameId]: old.id,
          UserId: req.user.id,
        };
        if (
          obj.data !== "updatedAt" &&
          `${obj.prevVal}` !== `${obj.newVal}` &&
          `${obj.prevVal}`.split("T")[0] !== `${obj.newVal}`
        ) {
          await ModelHistory.create(obj);
        }

        // console.log(obj);
      }
    }
    // console.log("[END ==========]");

    if (!doc) {
      return next(new AppError(`This document doesn't exist`, 404));
    }
    sendRes(res, 200);
    return next();
  } catch (err) {
    res.status(404).json({
      error: err,
    });
  }
};

// DELETE ONE DOCUMENT
exports.DeleteOne = (Model, ModelHistory, nameId) =>
  catchAsync(async (req, res, next) => {
    // console.log(req.params.id);
    const doc = await Model.destroy({ where: { id: req.params.id } });

    let obj = {
      data: "deletedAt",
      prevVal: null,
      newVal: "has been deleted",
      [nameId]: req.params.id,
      UserId: req.user.id,
    };
    // console.log(obj);
    // console.log(obj);
    if (obj.prevVal !== obj.newVal) {
      await ModelHistory.create(obj);
    }

    if (!doc) {
      return next(new AppError(`This document doesn't exist`, 404));
    }
    sendRes(res, 200, doc);
    return next();
  });

// CREATE ONE DOCUMENT
exports.Create = (Model) =>
  catchAsync(async (req, res, next) => {
    // console.log(req.body);
    // console.log({
    //   ...req.body,
    //   UserId: req.user.id,
    //   MagazinId: req.user.MagazinId,
    // });
    const data = {
      ...req.body,
      UserId: req.user.id,
      MagazinId: req.user.MagazinId,
    };
    // console.log(data);
    const doc = await Model.create({
      ...data,
    });
    // console.log(doc.id);

    await db[`${Model.name}History`].create({
      data: "createdAt",
      prevVal: null,
      newVal: null,
      [`${Model.name}Id`]: doc.id,
      UserId: req.user.id,
    });

    sendRes(res, 200, doc);
    return next();
  });

// GET NUMBER
exports.GetMaxMin = (Model) => {
  return catchAsync(async (req, res, next) => {
    const fieldName = req.params.field;
    // console.log(fieldName,"==================================")
    const results = await Model.findOne({
      attributes: [
        [Sequelize.fn("max", Sequelize.col(fieldName)), "maxValue"],
        [Sequelize.fn("min", Sequelize.col(fieldName)), "minValue"],
      ],
    });
    sendRes(res, 200, {
      max: results.dataValues.maxValue,
      min: results.dataValues.minValue,
    });
  });
};

// IMPORTANT !!!!!==============================================================================
function parseStringToArray(inputString) {
  // Remove the 'main' prefix and split the string into individual elements
  const elements = inputString.replace("main", "").match(/\[[^\]]+\]/g);

  if (elements) {
    // Remove the square brackets and return the array
    return elements.map((element) => element.slice(1, -1));
  } else {
    return [];
  }
}
// IMPORTANT !!!!!==============================================================================

// SEARCHING (REF FAMILY VEHICULE)
exports.Search = (SearchedModel, Model, include = [], Id) =>
  catchAsync(async (req, res, next) => {
    const idSet = new Set();
    if (req.query.search) {
      const Ids = await SearchedModel.findAll({
        where: {
          name: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        attributes: [Id],
        required: true,
        duplicating: false,
      });

      Ids.map((id) => {
        idSet.add(id[Id]);
      });
      // console.log(idSet, "EMPTY SUCKS");
    }
    const queryBuilder = new QueryBuilder(req.query);
    const { result } = queryBuilder
      .buildSorting()
      .buildFilter()
      .buildAttributes();
    const { limit, offset, attributes, order, where, ...restQuery } = result;
    let w = req.query.search ? { ...where, id: [...idSet] } : { ...where };
    const doc = await Model.findAll({
      where: { ...w },
      limit,
      offset,
      attributes,
      order,
      ...restQuery,
      required: true,
      duplicating: false,
      include: include,
    });

    if (!doc) {
      return next(new AppError("il n'y a pas de résultat", 404));
    }

    const length = await Model.count({
      ...restQuery,

      include: include,
      required: true,

      duplicating: false,
    });

    // console.log(l, "sidsjoifhfiud");
    // const length = doc.length;
    if (length === 0) {
      // return next(new AppError(`There are no documents`, 404));
      sendRes(res, 200, {
        doc_size: 0,
        pages: 1,
        currPage: 1,
        data: [],
      });
      return next();
    }

    // console.log(length, query);
    sendRes(res, 200, {
      doc_size: length,
      pages: !!((length / query.limit) % 1)
        ? Math.floor(length / query.limit) + 1
        : length / query.limit,
      currPage: +req.query.page || 1,
      data: doc,
    });
    return next();
  });

// EXPORT
exports.ExportFile =
  (Model, include = [], header = [], magazin = true) =>
  async (req, res, next) => {
    try {
      // console.log(req.body,'<HHHHHHHHHHHHHH>');
      let workbook = new excelJs.Workbook();
      let sheet = workbook.addWorksheet("sheet");
      sheet.columns = [...header];
      // { header: "Reference", key: "Ref.name", width: 25 },
      // { header: "Desigiantion", key: "name", width: 25 },
      // { header: "Qte", key: "quantity", width: 25 },
      // { header: "Prix", key: "price", width: 25 },
      // =================================================================================================

      // console.log(sheet.actualColumnCount,sheet.columns)
      // GET OBJECT
      const queryBuilder = new QueryBuilder(req.query);
      const { result } = queryBuilder
        .buildSorting()
        .buildFilter()
        .buildAttributes();

      const { limit, offset, ...cleanedQuery } =
        Model.name === "Entree"
          ? {
              ...result,
              where: {
                ...result.where,
                number: {
                  [Op.gt]: 0,
                },
              },
            }
          : {
              ...result,
            };
      cleanedQuery.where = magazin
        ? { ...cleanedQuery.where, MagazinId: req.user.MagazinId }
        : { ...cleanedQuery.where };

      // console.log(cleanedQuery);
      const data = await Model.findAll({
        include: include,
        ...cleanedQuery,
        required: true,
        duplicating: false,
      });
      const getmore = (id, arr) => {
        let value = { ...data[id] };
        arr.map((el) => {
          value = value[el] || "/";
        });
        // console.log(value);
        return value || "/";
      };
      // console.log(data[0]['name']);
      for (let i = 0; i < data.length; i++) {
        let obj = {};
        sheet.columns.map((el) => {
          obj[el.header] = `${el.key}`.includes(".")
            ? getmore(i, `${el.key}`.split("."))
            : data[i][el.key];
          // obj[el.key] = `${el.key}`.includes('.') ? `${el.key}`.split('.')  : data[i][el.key];
        });
        // console.log(Object.values(obj));
        sheet.addRow([...Object.values(obj)]);
      }
      // console.log(sheet.rows);
      // console.log(length, query.limit, "[AGAIN LENGTH AND QUERY]");
      // console.log(sheet.getRow(1), sheet.getRows());
      // console.log("HELLO", sheet.rowCount, data.length);
      const filename = `${Model.name}-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      // Set headers and send the workbook as a buffer
      // console.log("hh");
      res.attachment(filename);
      res.status(200).send(await workbook.xlsx.writeBuffer());
    } catch (err) {
      res.status(404).json({ err });
      return next();
    }
  };

exports.ExportFileForGasoil =
  (Model, include = [], columns = [], magazin = true) =>
  async (req, res, next) => {
    try {
      // Validate columns
      if (!columns.length) {
        throw new Error("Columns are required.");
      }

      // Create workbook and worksheet
      let workbook = new excelJs.Workbook();
      let sheet = workbook.addWorksheet("sheet");

      // Set sheet columns
      sheet.columns = [
        { header: "Date", key: "date", width: 20 },
        { header: "Engin", key: "vehicule", width: 30 },
        { header: "Qté", key: "quantity", width: 15 },
        { header: "Prix U HT", key: "price", width: 15 },
        { header: "Montant HT", key: "amount", width: 15 },
      ];

      // // Build query
      // const queryBuilder = new QueryBuilder(req.query);
      // const { result } = queryBuilder
      //   .buildSorting()
      //   .buildFilter()
      //   .buildAttributes();

      // const { limit, offset, ...cleanedQuery } = result

      // console.log(cleanedQuery)
      // Fetch data
      const data = await Model.findOne({
        where: { id: req.params.id },
        include,
        // ...cleanedQuery,
        // required: true,
        // duplicating: false,
      });

      // console.log(data.GasoilElements.length,'')

      if (!data) {
        throw new Error("No data found.");
      }

      // Group data by date
      const groupedData = data.GasoilElements.reduce((acc, item) => {
        const date = item.date; // Assuming `date` is a field in your model
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {});

      // Helper function to get nested values
      const getNestedValue = (obj, path) => {
        return path.split(".").reduce((acc, key) => acc?.[key] || "", obj);
      };

      // Add rows to the sheet
      Object.keys(groupedData).forEach((date) => {
        const items = groupedData[date];

        // Add date row
        sheet.addRow([date, "", "", "", ""]);

        // Add item rows
        items.forEach((item) => {
          const vehicule = item.Vehicule
            ? `${item.Vehicule.name} (${item.Vehicule.matricule})`
            : "";
          const quantity = item.quantity || 0;
          const price = item.price || 0;
          const amount = quantity * price;

          sheet.addRow(["", vehicule, quantity, price, amount]);
        });
      });

      // Calculate totals
      const totalQuantity = data.GasoilElements.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      const totalPrice = data.GasoilElements.reduce(
        (sum, item) => sum + (item.price || 0),
        0
      );
      const totalAmount = data.GasoilElements.reduce(
        (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
        0
      );

      // Add total row
      sheet.addRow([]); // Empty row for spacing
      sheet.addRow(["TOTAL HT", "", totalQuantity, totalPrice, totalAmount]);

      // Generate filename
      const filename = `${Model.name}-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      // Send response
      res.attachment(filename);
      res.status(200).send(await workbook.xlsx.writeBuffer());
    } catch (err) {
      console.error("ExportFile Error:", err);
      res.status(500).json({ error: "Failed to export file" });
      next(err);
    }
  };
