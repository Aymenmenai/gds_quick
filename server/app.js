const express = require("express");
const db = require("../models");
const articleRouter = require("./routes/articleRouter");
const statsRouter = require("./routes/statsRouter");

const feedbackRouter = require("./routes/feedbackRouter");
const beneficiareRouter = require("./routes/beneficiareRouter");
const sortieRouter = require("./routes/sortieRouter");
const gasoilElementRouter = require("./routes/gasoilElementRouter");
const gasoilRouter = require("./routes/gasoilRouter");
const gasoilEntreeRouter = require("./routes/gasoilEntreeRouter");
const gasoilSortieRouter = require("./routes/gasoilSortieRouter");
const entreeRouter = require("./routes/entreeRouter");
const articleQuiSortRouter = require("./routes/articleQuiSortRouter");
const fournisseurRouter = require("./routes/fournisseurRouter");
const unitRouter = require("./routes/unitRouter");
const vehiculeRouter = require("./routes/vehiculeRouter");
const vehiculeTypeRouter = require("./routes/vehiculeTypeRouter");
const refRouter = require("./routes/refRouter");
const referenceRouter = require("./routes/referenceRouter");
const sousFamilyRouter = require("./routes/sousFamilyRouter");
const FamilyRouter = require("./routes/familyRouter");
const tagRouter = require("./routes/tagRouter");
const userRouter = require("./routes/userRouter");
const brandRouter = require("./routes/brandRouter");
const vehiculeClientRouter = require("./routes/vehiculeClientRouter");
const magazinRouter = require("./routes/magazinRouter");
const historyRouter = require("./routes/historyRouter");
const movementRouter = require("./routes/movementRouter");
const dfcRouter = require("./routes/dfcRouter");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const routes = require("./routes/index.js");
const { protection, check } = require("./controllers/authorization");
const errorHandler = require("./controllers/errorHandler");
const compression = require("compression");
const API = require("./v2/API");
const { getRefStockTimeline } = require("./controllers/fichstockController");
const { getArticleStockTimeline } = require("./controllers/articleController");
const articleCountageRouter = require("./routes/artilceCountageRouter");
const countageRouter = require("./routes/countageRouter");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(compression());

app.use(cors());
// app.use(
//   cors({
//     origin: "http://192.168.0.5:8000",
//     credentials: true,
//   },
//   {
//     origin: "http://192.168.0.5:3000",
//     credentials: true,
//   },
// )
// );

// ✅ Handle OPTIONS requests properly
app.options("*", cors());

app.get("/api/v1/auth/check", protection, (req, res) => {
  res.status(200).json({
    auth: true,
  });
});

app.use("/api/v2/articlecountage", articleCountageRouter);
app.use("/api/v2/countage", countageRouter);
app.post("/api/v2/timeline/:id", getRefStockTimeline);
app.get("/api/v2/article/timeline/:id", getArticleStockTimeline);

app.use("/api", routes(app));
app.use("/api/v1/dfc", dfcRouter);
app.use("/api/v1/movement", movementRouter);
app.use("/api/v1/stats", statsRouter);
app.use("/api/v1/article", articleRouter);
app.use("/api/v1/sortie", sortieRouter);
app.use("/api/v1/gasoilsortie", gasoilSortieRouter);
app.use("/api/v1/gasoilentree", gasoilEntreeRouter);
app.use("/api/v1/gasoil", gasoilRouter);
app.use("/api/v1/gasoilelement", gasoilElementRouter);
app.use("/api/v1/beneficiare", beneficiareRouter);
app.use("/api/v1/articlequisort", articleQuiSortRouter);
app.use("/api/v1/entree", entreeRouter);
app.use("/api/v1/fournisseur", fournisseurRouter);
app.use("/api/v1/reference", referenceRouter);
app.use("/api/v1/vehicule", vehiculeRouter);
app.use("/api/v1/vehiculetype", vehiculeTypeRouter);
app.use("/api/v1/ref", refRouter);
app.use("/api/v1/sousFamily", sousFamilyRouter);
app.use("/api/v1/family", FamilyRouter);
app.use("/api/v1/unit", unitRouter);
app.use("/api/v1/magazin", magazinRouter);
app.use("/api/v1/mini", articleRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/vehiculeclient", vehiculeClientRouter);
app.use("/api/v1/tag", tagRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/feedback", feedbackRouter);
app.use("/api/v1/history", historyRouter);

// V2 =====================

const Routes = (Model, path) => {
  const api = new API(Model);
  // STATS
  app.use("/api/v2/", protection);
  // app.route(`/api/v2/${path}/stats`).get(api.stats);
  // CRUD REQUEST
  app.route(`/api/v2/${path}`).post(api.show);

  app.route(`/api/v2/${path}/export`).post(api.export);

  app.route(`/api/v2/${path}/add`).post(api.post);

  app
    .route(`/api/v2/${path}/:id`)
    .post(api.get)
    .patch(api.patch)
    .delete(api.delete);
};

Routes(db.Article, "article");
Routes(db.Ref, "ref");
Routes(db.ArticleQuiSort, "articlequisort");
Routes(db.GasoilSortie, "gasoilsortie");
Routes(db.GasoilElement, "gasoilelement");
Routes(db.GasoilEntree, "gasoilentree");
Routes(db.Entree, "entree");
Routes(db.Sortie, "sortie");
Routes(db.Reference, "reference");
Routes(db.Beneficiare, "beneficiare");
Routes(db.Fournisseur, "fournisseur");
Routes(db.Vehicule, "vehicule");
Routes(db.VehiculeClient, "vehiculeclient");
Routes(db.VehiculeType, "vehiculetype");
// Routes(db.User, 'user');
Routes(db.Feedback, "feedback");
Routes(db.Family, "family");
Routes(db.SousFamily, "sousfamily");
Routes(db.Tag, "tag");
Routes(db.Unit, "unit");
Routes(db.Brand, "brand");
Routes(db.Magazin, "magazin");

app.use("/*", errorHandler);

module.exports = app;
