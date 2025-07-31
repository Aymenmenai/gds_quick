const db = require("../../models");
const catchAsync = require("../utils/catchAsync");
const sendRes = require("../utils/sendRes");
const filterObj = require("../utils/filterObj");

// GET CURR USER
exports.getCurrentUser = catchAsync(async (req, res, next) => {
  const currUser = await db.User.findOne({
    where: { id: req.user.id },
    include: [
      {
        model: db.Magazin,
        attributes: ["name", "id"],
      },
    ],
  });
  const cleanUser = filterObj(
    { ...currUser.dataValues },
    "password",
    "passwordChangeAt",
    "createdAt",
    "updatedAt",
    "deletedAt"
  );
  // console.log(cleanUser,'CORRECT');
  sendRes(res, 200, { ...cleanUser });
});

// UPDATE USER
exports.updateUser = catchAsync(async (req, res, next) => {
  // console.log(req.body,req.user);
  // const data = {}
  const notAllowedData = [
    "password",
    "passwordChangeAt",
    "createdAt",
    "deletedAt",
    "role",
    "updatedAt",
  ];
  // console.log(req.body)
  if (req.user.role === "admin") {
    if (req.user.MagazinId === 1) {
      notAllowedData.push("MagazinId");
    } else if (req.body.MagazinId === 1) {
      // All other admin users with MagazinId === 1 are allowed
      return next();
    }
  }
  

  const clean = filterObj({ ...req.body }, ...notAllowedData);

  const updated = await db.User.update(
    { ...clean },
    { where: { id: req.user.id } }
  );
  sendRes(res, 200, updated);
});

