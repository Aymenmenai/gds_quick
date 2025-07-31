const { Op } = require("sequelize");
const db = require("../../models");
const sendRes = require("../utils/sendRes");
const AppError = require("../utils/appError");

const endDayHandler = (time, startedate) => {
  switch (time) {
    case "today":
      return new Date(startedate + 24 * 3600 * 1000);
    case "week":
      return new Date(startedate + 7 * 24 * 3600 * 1000);
    case "six":
      return new Date(startedate + 180 * 24 * 3600 * 1000);
    case "year":
      return new Date(startedate + 365 * 24 * 3600 * 1000);
    default:
      return new Date(startedate + 24 * 3600 * 1000);
  }
};

const intervalHandler = (time) => {
  switch (time) {
    case "today":
      return 3600 * 1000;
    case "week":
      return 24 * 3600 * 1000;
    case "six":
      return 30 * 24 * 3600 * 1000;
    case "year":
      return 30 * 24 * 3600 * 1000;
    default:
      return 3600 * 1000;
  }
};

function splitTimeIntervals(startDate, endDate, interval) {
  const currentDate = startDate;
  currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
  const desiredDate = endDate.getTime();

  const intervals = [];

  let intervalStart = Math.max(currentDate.getTime(), startDate.getTime());
  let intervalEnd = Math.min(desiredDate, intervalStart + interval) + 1000;

  while (intervalStart < desiredDate) {
    intervals.push({
      start: new Date(intervalStart),
      end: new Date(intervalEnd),
    });

    intervalStart = intervalEnd;
    intervalEnd = Math.min(desiredDate, intervalStart + interval);
  }

  return intervals;
}

// GET STATE IO
exports.getStatsIO = async (req, res, next) => {
  try {
    let stats = [];

    const startDate = req.body.startedDay
      ? new Date(req.body.startedDay)
      : new Date(Date.now());
    startDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
    const endDate = endDayHandler(req.body.time, startDate.getTime());
    endDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
    const interval = intervalHandler(req.body.time); // 30 days in milliseconds

    const arr = splitTimeIntervals(startDate, endDate, interval);

    for (let el in arr) {
      try {
        const resultEntree = await db.Entree.findAll({
          where: {
            createdAt: {
              [Op.between]: [arr[el].start, arr[el].end],
            },
          },
          include: [
            {
              model: db.Article,
              attributes: ["quantity"],
            },
          ],
        });

        const resultSortie = await db.Sortie.findAll({
          where: {
            createdAt: {
              [Op.between]: [arr[el].start, arr[el].end],
            },
          },
          include: [
            {
              model: db.ArticleQuiSort,
              attributes: ["quantity", "price"],
            },
          ],
        });

        let total_price = 0;
        let total_quantity = 0;

        let total_price_s = 0;
        let total_quantity_s = 0;
        // GET TOTAL PRICE
        resultEntree.map((el) => {
          total_price = total_price + el.total_price;
          el.Articles.map((e) => {
            total_quantity = total_quantity + e.quantity;
          });
        });

        resultSortie.map((el) => {
          total_price_s = total_price_s + el.total_price;
          el.ArticleQuiSorts.map((e) => {
            total_quantity_s = total_quantity_s + e.quantity;
          });
        });

        stats.push({
          start: arr[el].start,
          end: arr[el].end,
          entree: resultEntree.length,
          sortie: resultSortie.length,
          priceEntree: total_price,
          QuantityEntree: total_quantity,
          priceSortie: total_price_s,
          QuantitySortie: total_quantity_s,
        });
      } catch (err) {
        return next(new AppError(err, 404));
      }
    }
    sendRes(res, 200, [...stats]);
  } catch (err) {
    sendRes(res, 404, err);
  }
};

// PIE
exports.getStatsPie = async (req, res, next) => {
  try {
    const startDate = req.body.startedDay
      ? new Date(req.body.startedDay)
      : new Date(Date.now());
    startDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
    const endDate = endDayHandler(req.body.time, startDate.getTime());
    endDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero

    const resultEntree = await db.Entree.count({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    const resultSortie = await db.Sortie.count({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const total = resultEntree + resultSortie;

    sendRes(res, 200, {
      start: startDate,
      end: endDate,
      entree: (resultEntree * 100) / total,
      sortie: (resultSortie * 100) / total,
    });
  } catch (err) {
    sendRes(res, 404, err);
  }
};
// STANDARD FOR ANYTHING (FOURNISSEUR,BENEFICIARE)
exports.getStatsStandard = async (req, res, next) => {
  try {
    const startDate = req.body.startedDay
      ? new Date(req.body.startedDay)
      : new Date(Date.now());
    startDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
    const endDate = endDayHandler(req.body.time, startDate.getTime());
    endDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero

    const studiedFild = await db.Fournisseur.findAll({
      include: [
        {
          model: db.Entree,
          attributes: ["id"],
          where: {
            date: {
              [Op.between]: [startDate, endDate],
            },
          },
        },
      ],
    });

    const arr = studiedFild.map((fournisseur) => ({
      id: fournisseur.id,
      name: fournisseur.name,
      UserId: fournisseur.UserId,
      Entrees: fournisseur.Entrees.length,
    }));

    sendRes(res, 200, arr);
  } catch (err) {
    sendRes(res, 404, err);
  }
};

// HOW MUCH WE BUYED EACH MONTH
