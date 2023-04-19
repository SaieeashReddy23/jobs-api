const mongoose = require('mongoose')

const Job = mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'pls provide the job name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'pls provide the position '],
      maxlength: 50,
    },
    status: {
      type: String,
      enum: ['declined', 'pending', 'interview'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'pls provide the user'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Job', Job)
