const jwt = require('jsonwebtoken');

exports.sendToken = (id) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  return token;
};
// CREATE A COOKIE
exports.createCookie = (name, value, expiresTime, res) => {
  const cookieOption = {
    expireIn: new Date(Date.now() + expiresTime * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOption.secure = true;
  }
  res.cookie(name, value, cookieOption);
};