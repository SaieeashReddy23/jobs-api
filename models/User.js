// require('dotenv')
const mongoose = require('mongoose')

const bcryptjs = require('bcryptjs')

const Jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'pls provide name'],
    maxlength: 50,
    minlength: 3,
  },

  email: {
    type: String,
    required: [true, 'pls provide emai'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },

  password: {
    type: String,
    required: [true, 'pls provide the password'],
    minlength: 6,
  },
})

userSchema.pre('save', async function () {
  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt)
})

userSchema.methods.createJWT = function () {
  const token = Jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )

  return token
}

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = bcryptjs.compare(candidatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model('User', userSchema)
