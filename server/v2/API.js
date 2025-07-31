const db = require("../../models");
const catchAsync = require("../utils/catchAsync");
const Err = require("./Err");
const filter = require("./filter");
const Query = require("./Query");
const excelJs = require("exceljs");

const resolveIncludeModels = (include, db) => {
  return include.map((item) => {
    const model = db[item.model];
    if (!model) throw new Error(`Model "${item.model}" not found in db`);

    const resolved = {
      ...item,
      model,
    };

    if (item.include && Array.isArray(item.include)) {
      resolved.include = resolveIncludeModels(item.include, db);
    }

    return resolved;
  });
};

class API {
  constructor(Model) {
    this.Model = Model;
  }

  async history(data, id, prevVal, newVal, userId) {
    if (prevVal !== newVal) {
      await db[`${this.Model.name}History`].create({
        data,
        prevVal,
        newVal,
        [`${this.Model.name}Id`]: id,
        UserId: userId,
      });
    }
  }

  result(res, code, message = "Success", page, size, data) {
    res.status(code).json({
      status: "success",
      message,
      page,
      size,
      data,
    });
  }

  show = catchAsync(async (req, res, next) => {
    const cl = new Query(this.Model.tableName, req);
    const { query } = cl
      .sqlinclude()
      .sqlfilter()
      .sqlsort()
      .sqlfields()
      .sqlpages();

    const sqlQuery = `
      SELECT json_build_object(
        'size', (SELECT COUNT(*) FROM "${this.Model.tableName}" ${
      query.includeString || ""
    } ${query.whereString}),
        'data', json_agg(row_to_json(item))
      ) AS result
      FROM (
        SELECT ${query.fieldString}
        FROM "${this.Model.tableName}"
        ${query.includeString || ""}
        ${query.whereString}
        ORDER BY ${query.sortString}
        ${query.pageString}
      ) AS item;
    `;
    // console.log(sqlQuery);

    const result = await this.Model.sequelize.query(sqlQuery, {
      type: db.Sequelize.QueryTypes.SELECT,
    });
    // console.log(result);

    this.result(
      res,
      200,
      "Fetched successfully",
      query.page,
      result[0].result.size,
      result[0].result.data
    );
  });

  get = catchAsync(async (req, res, next) => {
    const { include } = req.body;
    const ids = req.params.id
      ?.split(",")
      .map((id) => parseInt(id))
      .filter(Boolean);

    if (!ids || ids.length === 0) {
      return next(new Err("Invalid or missing ID(s)", 400));
    }

    let resolvedInclude;
    try {
      resolvedInclude = include ? resolveIncludeModels(include, db) : undefined;
    } catch (err) {
      return next(new Err(err.message, 400));
    }

    const data = await this.Model.findAll({
      where: { id: ids },
      include: resolvedInclude,
    });

    if (!data || data.length === 0) {
      return next(new Err(`No items found for the provided ID(s)`, 404));
    }

    this.result(res, 200, "Items fetched successfully", 1, data.length, data);
  });

  post = catchAsync(async (req, res, next) => {
    const body = filter(
      req.body,
      "UserId",
      "createdAt",
      "id",
      "MagazinId",
      "UserId"
    );
    console.log(body);

    const data = await this.Model.create({
      ...body,
      UserId: req.user.id,
      MagazinId: req.user.MagazinId,
    });

    this.result(res, 201, "Item has been created successfully", 1, 1, data);
  });

  patch = catchAsync(async (req, res, next) => {
    const body = filter(
      req.body,
      "UserId",
      "createdAt",
      "updatedAt",
      "id",
      "role"
    );

    const data = await this.Model.findOne({ where: { id: req.params.id } });

    if (!data) return next(new Err(`This document doesn't exist`, 404));

    for (let key of Object.keys(body)) {
      await this.history(key, req.params.id, data[key], body[key], req.user.id);
      data[key] = body[key];
    }

    await data.save();
    this.result(res, 204, "Item has been updated successfully", 1, 1, data);
  });

  delete = catchAsync(async (req, res, next) => {
    const data = await this.Model.destroy({ where: { id: req.params.id } });

    if (!data) return next(new Err(`This document doesn't exist`, 404));

    await this.history("deletedAt", req.params.id, false, true, req.user.id);
    this.result(res, 201, "Item has been deleted successfully", 1, 1, data);
  });

  export = catchAsync(async (req, res, next) => {
    function mapHeaders(headers, width = 25) {
      return headers.map((h) => ({
        key: h.value ?? h.field,
        header: h.name,
        width,
      }));
    }

    const workbook = new excelJs.Workbook();
    const sheet = workbook.addWorksheet(this.Model.name);
    sheet.columns = mapHeaders(req.body.headers);

    // Build SQL query (no pagination)
    const cl = new Query(this.Model.tableName, req);
    const { query } = cl.sqlinclude().sqlfilter().sqlsort().sqlfields();

    const sqlQuery = `
      SELECT ${query.fieldString}
      FROM "${this.Model.tableName}"
      ${query.includeString || ""}
      ${query.whereString}
      ORDER BY ${query.sortString};
    `;

    const rows = await this.Model.sequelize.query(sqlQuery, {
      type: db.Sequelize.QueryTypes.SELECT,
    });

    const totals = {};
    const totalColumns = [];

    // Write data rows
    rows.forEach((row) => {
      const values = sheet.columns.map((col) => {
        const keys = col.key.split(".");
        return keys.reduce((val, key) => (val ? val[key] : null), row);
      });

      const newRow = sheet.addRow(values);

      newRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        const val = cell.value;

        if (typeof val === "string" && val.includes("DA")) {
          const num = parseFloat(val.replace(/[^\d.-]/g, ""));
          if (!isNaN(num)) {
            cell.value = num;
            cell.numFmt = '#,##0.00" DA"';

            const key = sheet.columns[colNumber - 1].key;
            totals[key] = (totals[key] || 0) + num;

            if (!totalColumns.includes(key)) {
              totalColumns.push(key);
            }
          }
        }
      });
    });

    // Add empty spacer row
    sheet.addRow([]);

    // Build total row
    // const totalRow = sheet.columns.map((col, i) => {
    //   if (i === 0) return "TOTAL";
    //   const key = col.key;
    //   if (totals[key]) return totals[key];
    //   return "";
    // });

    // const row = sheet.addRow(totalRow);
    // row.font = { bold: true };

    // Apply DA formatting to total row columns
    // row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    //   const key = sheet.columns[colNumber - 1].key;
    //   if (totalColumns.includes(key)) {
    //     cell.numFmt = '#,##0.00" DA"';
    //   }
    // });

    const filename = `${this.Model.name}-${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    res.attachment(filename.toLowerCase());
    res.status(200).send(await workbook.xlsx.writeBuffer());
  });
}

module.exports = API;
