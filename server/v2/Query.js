const { Op } = require("sequelize");
const db = require("../../models");

// FOBBEDIEN ROUTER FOR MAGAZING
// config/magazinModels.js
const FORBIDDEN_MODELS = [
  "GasoilEntrees",
  "GasoilSorties",
  "Units",
  "Tags",
  "Brands",
  "Vehicules",
  "Beneficiares",
  "VehiculeClients",
  "GasoilElements",
];

class Query {
  queryString;
  constructor(model, req) {
    this.queryString = req.query;
    this.include = req.body?.include || undefined;
    this.model = model;
    this.query = {};
    this.req = req;
  }

  // FILTERING  !!! BUILD IT TO MANAGE THE SEARCH TOO
  filter() {
    const numFields = ["id", "number", "price", "quantity", "tax", "date"];
    const excludedFields = ["page", "limit", "sort", "fields"];
    let queryObj = { ...this.queryString };
    let filter = {};

    excludedFields.forEach((el) => delete queryObj[el]);

    // Prepare the filter object for SQL WHERE clause
    Object.keys(queryObj).forEach((key) => {
      let field = key;
      let value = queryObj[key];
      let parts = key.split(".");

      // Handle nested fields (associations)
      if (parts.length > 1) {
        // For Sequelize where clause
        field = `$${key}$`;
      }

      if (typeof value === "object" && !Array.isArray(value)) {
        // Handle operators like {gt: 10}
        filter[field] = {};
        Object.keys(value).forEach((op) => {
          let val = value[op];
          if (Array.isArray(val) || val.includes(",")) {
            val = Array.isArray(val) ? val : val.split(",");
          }
          // Translate operators to Sequelize operators
          filter[field][Op[op]] = val;
        });
      } else {
        // Handle simple values
        if (value.includes(",")) {
          value = value.split(",");
        }

        let isNumeric = false;
        numFields.forEach((a) => {
          if (field.toLowerCase().includes(a)) {
            isNumeric = true;
          }
        });

        if (Array.isArray(value)) {
          filter[field] = { [Op.in]: value };
        } else if (isNumeric) {
          filter[field] = +value;
        } else {
          filter[field] = { [Op.iLike]: `%${value}%` };
        }
      }
    });

    // Add deletedAt condition
    filter.deletedAt = null;

    this.query = { ...this.query, where: filter };
    return this;
  }
  // SORT
  sort() {
    if (!this.queryString.sort) return this;

    const sort = [];

    const sortBy = this.queryString.sort.split(",");
    sortBy.forEach((e) => {
      const isDesc = e.startsWith("-");
      const raw = isDesc ? e.slice(1) : e;
      const parts = raw.split(".");
      const column = parts.pop();

      let alias;

      if (parts.length === 0) {
        // Top-level field (e.g. 'date')
        alias = this.model;
      } else if (parts.length === 1) {
        alias = `J_${this.model}_${parts[0]}`;
      } else if (parts.length >= 2) {
        alias = `J_${parts[parts.length - 2]}_${parts[parts.length - 1]}`;
      }

      sort.push([alias, column, isDesc ? "DESC" : "ASC"]);
    });

    this.query = { ...this.query, order: sort };
    return this;
  }

  // FIELDS
  fields() {
    if (!!this.queryString?.fields) {
      this.attributes = !this.query?.attributes
        ? [...this.queryString.fields.split(",")]
        : [...this.queryString.fields.split(","), ...this.query.attributes];
      this.query = { ...this.query, attributes: this.attributes };
    }

    return this;
  }
  // PAGES
  pages() {
    // console.log(this.queryString)
    const page = this.queryString?.page ? parseInt(this.queryString?.page) : 1;
    const limit = this.queryString?.limit
      ? parseInt(this.queryString?.limit)
      : 15;
    const offset = (page - 1) * limit;
    this.query = { ...this.query, page, limit, offset };
    return this;
  }
  // INCLUDE
  includes() {
    if (this.include == undefined) return this;

    function transformModels(input) {
      return input.map((item) => {
        const modelRef = db[item.model];

        if (!modelRef) {
          throw new Error(`Model "${item.model}" not found in db`);
        }

        let transformed = { ...item, model: modelRef };

        if (item.include) {
          transformed.include = transformModels(item.include);
        }

        return transformed;
      });
    }

    const include = transformModels(this.include); // converts strings to models
    this.query = { ...this.query, include };

    return this;
  }
  // RETURN SQL REQUERIES
  sqlfilter() {
    this.filter();

    if (this.query.where != {}) {
      const where = this.buildWhereClause(this.query.where);
      const whereString = where && Object.keys(where).length > 0 ? where : "";
      // REMOVE DELETED ONE
      this.query = { ...this.query, whereString };
    }
    return this;
  }
  sqlsort() {
    this.sort();

    const sortString =
      Array.isArray(this.query.order) && this.query.order.length > 0
        ? this.query.order
            .map(([alias, column, dir]) => `"${alias}"."${column}" ${dir}`)
            .join(", ")
        : `"${this.model}".id`;

    this.query = { ...this.query, sortString };
    return this;
  }
  sqlfields() {
    this.fields();

    const formatField = (attr) => {
      const rawAttr = attr.replace(/^"[^"]+"\./, "").replace(/"/g, "");
      if (attr.includes("J_")) return attr;

      const qualifiedAttr = `"${this.model}"."${rawAttr}"`;

      if (
        ["price", "total_price", "amount", "total_amount"].includes(rawAttr) &&
        !this.model.includes("Gasoil")
      ) {
        return `TO_CHAR(${qualifiedAttr}, 'FM999,999,990.00') || ' DA' AS "${rawAttr}"`;
      }
      if (
        ["price", "total_price", "amount", "total_amount"].includes(rawAttr) &&
        this.model.includes("Gasoil")
      ) {
        return `TO_CHAR(${qualifiedAttr}, 'FM999,999,990.000') || ' DA' AS "${rawAttr}"`;
      }

      // if (["date", "createdAt", "updatedAt"].includes(rawAttr)) {
      //   return `TO_CHAR(${qualifiedAttr}, 'DD/MM/YYYY') AS "${rawAttr}"`;
      // }

      return qualifiedAttr;
    };

    const fieldString =
      this.query.attributes && this.query.attributes.length > 0
        ? this.query.attributes.map(formatField).join(", ")
        : `"${this.model}".*`;

    this.query = { ...this.query, fieldString };
    return this;
  }
  sqlpages() {
    this.pages();
    const pageString = `LIMIT ${this.query.limit || 15} OFFSET ${
      this.query.offset || 0
    }`;
    this.query = { ...this.query, pageString };
    return this;
  }
  sqlinclude() {
    this.includes();
    const parsedIncludes = this.query?.include;

    if (!parsedIncludes || !Array.isArray(parsedIncludes)) {
      return this;
    }

    let n = [];
    let j = [];

    const includeAttribute = (arr, currentParent) => {
      arr.forEach((item) => {
        const modelName = item.model?.name || item.model; // use model class or string
        if (item.attributes) {
          item.attributes.forEach((attr) => {
            n.push(
              `"J_${currentParent}_${modelName}".${attr} AS "${`${modelName}`.toLowerCase()}_${attr}"`
            );
          });
        }

        if (item.include) {
          includeAttribute(item.include, modelName);
        }
      });
    };

    const includeJoin = (arr, parentStack) => {
      arr.forEach((item) => {
        const modelName = item.model?.name || item.model;
        const parentAlias =
          parentStack.length === 1
            ? parentStack[0]
            : `J_${parentStack.slice(-2).join("_")}`;

        const joinAlias = `J_${
          parentStack[parentStack.length - 1]
        }_${modelName}`;
        const fk = `${modelName}Id`;
        const tableName = `${modelName}`.endsWith("y")
          ? modelName.slice(0, -1) + "ies"
          : modelName + "s";

        j.push(
          `LEFT JOIN "${tableName}" AS "${joinAlias}" ON "${parentAlias}"."${fk}" = "${joinAlias}".id`
        );

        if (item.include) {
          includeJoin(item.include, [...parentStack, modelName]);
        }
      });
    };

    includeAttribute(parsedIncludes, this.model);
    includeJoin(parsedIncludes, [this.model]);

    this.query.attributes = n;
    this.query.includeString = j.join("\n");

    return this;
  }
  // HELPER METHODS
  buildWhereClause(where) {
    const conditions = [];

    const processCondition = (field, condition) => {
      const isNestedField = field.startsWith("$") && field.endsWith("$");
      const fieldName = isNestedField
        ? field
            .slice(1, -1)
            .split(".")
            .map((part) => `"${part}"`)
            .join(".")
        : `"${this.model}"."${field}"`;

      if (typeof condition === "object" && condition !== null) {
        // Process both regular and Symbol operators
        const operators = [];

        // String-key operators
        for (const [operator, value] of Object.entries(condition)) {
          operators.push({ operator, value });
        }

        // Symbol operators
        for (const symbol of Object.getOwnPropertySymbols(condition)) {
          operators.push({
            operator: symbol.description,
            value: condition[symbol],
          });
        }

        // Handle all operators
        operators.forEach(({ operator, value }) => {
          switch (operator) {
            case "gte":
              conditions.push(`${fieldName} >= '${value}'`);
              break;
            case "lte":
              conditions.push(`${fieldName} <= '${value}'`);
              break;
            case "iLike":
              conditions.push(`${fieldName} ILIKE '%${value}%'`);
              break;
            case "eq":
              conditions.push(`${fieldName} = '${value}'`);
              break;
            case "ne":
              conditions.push(`${fieldName} != '${value}'`);
              break;
            case "in":
              const values = Array.isArray(value) ? value : [value];
              conditions.push(
                `${fieldName} IN (${values.map((v) => `'${v}'`).join(", ")})`
              );
              break;
            default:
              conditions.push(`${fieldName} = '${value}'`);
          }
        });
      } else {
        conditions.push(`${fieldName} = '${condition}'`);
      }
    };

    // Process all conditions
    for (const [field, condition] of Object.entries(where)) {
      if (field === "deletedAt" && condition === null) {
        conditions.push(`"${this.model}"."deletedAt" IS NULL`);
      } else {
        processCondition(field, condition);
      }
    }

    if (!FORBIDDEN_MODELS.includes(this.model)) {
      conditions.push(
        `"${this.model}"."MagazinId" = '${this.req.user.MagazinId}'`
      );
    }

    return conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  }
}

module.exports = Query;
