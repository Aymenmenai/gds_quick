const { promisify } = require("util");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const db = require("../../models");
const { createCookie, sendToken } = require("../utils/token");
const AppError = require("../utils/appError");
const filterObj = require("../utils/filterObj");

// CHECK IF REFRESHTOKEN IS VALID
exports.protection = catchAsync(async (req, res, next) => {
  // console.log(req);
  let token = req.cookies.auth;
  if (!token) {
    return next(new AppError("Please log in", 401));
  }

  // Verify that the token is not expired
  const decodedToken = jwt.decode(token);
  if (decodedToken.exp < Date.now() / 1000) {
    return next(new AppError("Session expired. Please log in again.", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // CHECK IF THE USER STILL EXISTS
  const currentUser = await db.User.findOne({
    where: { id: decoded.id },
  });

  const cleanUser = filterObj(
    { ...currentUser.dataValues },
    "password",
    "passwordChangeAt",
    "createdAt",
    "updatedAt",
    "deletedAt"
  );
  req.user = cleanUser;
  res.locals.user = cleanUser;

  // STORE USER IN LOCALSTORAGE

  return next();
});

// CHECK IF USER EXIST
// exports.check=catchAsync(async(req,res,next)=>{
//   console.log(req.user)
//   if(!req.user){
//     return next(new AppError('please log in',400))
//   }
//   return next()
// })

// AUTHORIZATION
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to do this action", 403)
      );
    }
    next();
  };
};
