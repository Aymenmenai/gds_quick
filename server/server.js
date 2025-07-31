require("dotenv").config({ path: "../.env" });
const app = require("./app");
const next = require("next");
const db = require("../models");

const PORT = 3000;
const mode = "production";
// const mode = "developement";
const dev = mode !== "production";
const api = next({ dev });

const handle = api.getRequestHandler();

api
  .prepare()
  .then(() => {
    app.all("*", (req, res) => {
      return handle(req, res);
    });

    const server = app.listen(PORT, () => {
      console.log(
        `server is listening on port ${PORT}\n${mode} mode `
        // `server is listening on port ${PORT}\n${process.env.APP_ENV} mode `
      );
    });
    db.sequelize
      .sync({ logging: false }) // Setting logging to false
      .then(() => {
        console.log("database had connected");
      })
      .catch((err) => {
        console.log("Unable to connect to the database : ", err);
      });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
