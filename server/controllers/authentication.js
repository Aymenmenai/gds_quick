const db = require("../../models");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendToken, createCookie } = require("../utils/token");
const filterObj = require("../utils/filterObj");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
// const requestIp = require('request-ip');
// const http = require('http');

// STATES
const createStatus = (user, statusCode, req, res) => {
  const accessToken = sendToken(
    user.id,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES
  );
  createCookie("auth", accessToken, process.env.JWT_EXPIRES, res);
  // console.log(accessToken,user)
  const cleanUser = filterObj(
    { ...user.dataValues },
    "password",
    "passwordChangeAt",
    "createdAt",
    "updatedAt"
  );
  res.status(statusCode).json({
    status: "success",
    token: accessToken,
    data: cleanUser,
  });
};

// SIGN UP
exports.signup = catchAsync(async (req, res, next) => {
  const { name, password, confirmPassword } = req.body;
  if (password != confirmPassword) {
    return next(new AppError("Passwords are not similar", 400));
  }

  // Crybting th data
  const crybedPass = await bcrypt.hash(password, 12);
  const newUser = await db.User.create({
    name,
    password: crybedPass,
  });

  // await new Email(newUser, url).sendWelcome();
  res.status(200).json({
    status: "success",
    message: newUser,
  });
});

// LOG IN
exports.login = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;
  // console.log(name,password)
  if (!name || !password) {
    return next(new AppError("please enter your password and name", 400));
  }
  const loggedUser = await db.User.findOne({
    where: { name },
  });
  if (!loggedUser || !(await bcrypt.compare(password, loggedUser.password))) {
    return next(new AppError("name or password is not corrected", 400));
  }

  const saveUser = filterObj(
    { ...loggedUser.dataValues },
    "password",
    "passwordChangeAt",
    "createdAt",
    "updatedAt",
  );
  // req.user = cleanUsezr;
  // res.locals.user = cleanUser;

  // const saveUser = {
  //   id: loggedUser.id,
  //   name: loggedUser.name,
  // };
  req.user = saveUser;
  res.locals.user = saveUser;
  createStatus(loggedUser, 200, req, res);
});

// LOGOUT
exports.logout = (req, res, message) => {
  if (message === "") {
    message = "you logged out";
  }
  res.cookie("auth", "", {
    expires: new Date(Date.now() + 10 * 100),
    httpOnly: true,
    secure: true,
  });
  req.user = undefined;
  res.locals.user = undefined;
  return res.status(200).json({ status: "success", message });
};

// RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, confirmPassword, userId } = req.body;

  const user = await db.User.findOne({
    where: { id: userId },
  });
  if (!user) {
    return next(new AppError("this link is invalid", 404));
  }

  if (password != confirmPassword) {
    return next(new AppError("Passwords are not similar", 400));
  }

  // Crybting th data
  const crybedPass = await bcrypt.hash(password, 12);
  db.User.update({ password: crybedPass }, { where: { id: user.id } });
  res.status(200).json({
    status: "success",
    message: "You password has been changed",
  });
});

// UPDATE PASSWORD
exports.updatePassword = catchAsync(async (req, res, next) => {
  // verify if the input is old password,new one and confirm
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  // console.log(oldPassword, newPassword, confirmNewPassword);
  if (!oldPassword || !newPassword || !confirmNewPassword) {
    return next(
      new AppError(
        "please enter your old password ,new password, and confirm new password",
        400
      )
    );
  }
  // verify password is corrected
  // import user
  const user = await db.User.findOne({ where: { id: req.user.id } });
  if (!(await bcrypt.compare(oldPassword, user.password))) {
    return next(new AppError("password is not correct", 400));
  }
  // check if new password and confirm password are same and valid
  if (newPassword != confirmNewPassword) {
    return next(new AppError("Passwords are not similar", 400));
  }

  const crybedPass = await bcrypt.hash(newPassword, 12);
  db.User.update(
    { password: crybedPass, passwordChangeAt: Date.now() },
    { where: { id: user.id } }
  );
  createStatus(user, 201, req, res, "");
});
