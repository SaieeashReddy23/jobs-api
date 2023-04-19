const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, resp) => {
  const user = await User.create({ ...req.body })

  const token = user.createJWT()

  resp.status(StatusCodes.CREATED).json({ userName: user.name, token })
}

const login = async (req, resp) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  const token = user.createJWT()

  resp.status(StatusCodes.OK).json({ name: user.name, token })
}

module.exports = { register, login }
