const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err)

  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong try later',
  }

  if (err.name && err.name == 'ValidationError') {
    const errorMessage = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')

    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.message = errorMessage
  }
  if (err.code && err.code == 11000) {
    customError.message = `Duplicate value entered for the object key : ${Object.keys(
      err.keyValue
    )}  field , pls choose another value`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if (err.name && err.name == 'CastError') {
    customError.message = ` No item found with the id : ${err.value}`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  return res.status(customError.statusCode).json({ msg: customError.message })
}

module.exports = errorHandlerMiddleware
