const User = require('../models/User')
const Jwt = require('jsonwebtoken')

const { UnauthenticatedError } = require('../errors/')

const auth = async (req, resp, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid')
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = Jwt.verify(token, process.env.JWT_SECRET)

    req.user = { userId: payload.userId, name: payload.name }

    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth
