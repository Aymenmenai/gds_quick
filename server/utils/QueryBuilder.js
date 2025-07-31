const { Op } = require("sequelize");

class QueryBuilder {
  constructor(queryString) {
    this.queryString = queryString;
    this.filter = {};
    this.sort = [];
    this.attributes = [];
    this.page = queryString.page ? parseInt(queryString.page) : 1;
    this.limit = queryString.limit ? parseInt(queryString.limit) : 17;
    this.offset = (this.page - 1) * this.limit;
    this.result = { page: this.page, limit: this.limit, offset: this.offset };
  }

  buildFilter() {
    const numFields = ["id", "number", "price", "quantity", "tax", "date"];
    const excludedFields = ["page", "limit", "sort", "fields", "search"];
    let queryObj = { ...this.queryString };
    let filter = {};

    excludedFields.forEach((el) => delete queryObj[el]);

    Object.keys(queryObj).forEach((key) => {
      let field = key;
      let value = queryObj[key];
      let parts = key.split(".");
      if (parts.length > 1) {
        field = `$${parts.join(".")}$`;
      }

      // console.log(value,'helloooo filter');
      if (typeof value === "object") {
        filter[field] = {};
        Object.keys(value).forEach((op) => {
          let val = value[op];
          if (val.includes(",")) {
            val = val.split(",");
          }
          filter[field][Op[op]] = val;
        });
      } else {
        if (value.includes(",")) {
          value = value.split(",");
        }

        let run = false;
        numFields.filter((a) => {
          // console.log(field.toLowerCase().includes(a), a, field);
          if (field.toLowerCase().includes(a)) {
            filter[field] = +value;
            run = true;
          }
        });
        if (!run) {
          // ANY OTHER
          filter[field] = { [Op.iRegexp]: value };
        }
      }
    });

    this.result = { ...this.result, where: { ...filter } };
    return this;
  }

  buildSorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",");
      sortBy.forEach((e) => {
        let el = e.startsWith("-") ? e.substring(1) : e;
        let parts = el.split(".");
        let columnName = null;
        let associations = [];

        if (parts.length > 1) {
          for (let i = 0; i < parts.length - 1; i++) {
            const associationName = parts[i];
            associations.push({ model: associationName, as: associationName });
          }

          columnName = parts[parts.length - 1];
        } else {
          columnName = el;
        }

        this.sort.push([
          ...associations,
          columnName,
          e.startsWith("-") ? "DESC" : "ASC",
        ]);
      });
    }
    this.result = { ...this.result, order: this.sort };
    return this;
  }

  buildAttributes() {
    if (this.queryString.fields) {
      this.attributes = this.queryString.fields.split(",");
      this.result = { ...this.result, attributes: this.attributes };
    }
    return this;
  }
}

module.exports = QueryBuilder;
