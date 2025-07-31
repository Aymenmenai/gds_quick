const AppError = require('../utils/appError');


const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  const message = `Duplicate field "${err.keyValue.name}" , please choose another field!`;
  return new AppError(message, 400);
};

const handleValidatorError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again!', 401);

const sendErrorDev = (err, res, req) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      errorStack: err.stack,
    });
  }
  // eslint-disable-next-line no-console
  console.log('ERROR', err);
  return res.status(err.statusCode).json( {
    title: 'Something went wrong',
    Msg: err.message,
    Code: err.statusCode,
  });
};

const sendErrorProd = (err, res, req) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).json( {
      Msg: err.message,
      Code: err.statusCode,
    });
  }
  return res.status(500).json( {
    Msg: 'Something went wrong, Please try again later',
    Code: 500,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // console.log(process.env.APP_ENV)
  if (process.env.APP_ENV === 'development') {
    sendErrorDev(err, res, req);
  } else {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldDB(error);
    if (err.name === 'SequelizeUniqueConstraintError') error = handleValidatorError(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    // if (err.name === 'SequelizeUniqueConstraintError')
      // error = SequelizeValidation();
    sendErrorProd(error, res, req);
  }
};
