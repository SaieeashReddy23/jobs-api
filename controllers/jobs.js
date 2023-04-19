const User = require('../models/User')
const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors/')

const getAllJobs = async (req, resp) => {
  const { userId } = req.user

  const jobs = await Job.find({ createdBy: userId }).sort('createdAt')

  resp.status(StatusCodes.OK).json({ count: jobs.length, jobs })
}

const createJob = async (req, resp) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create({ ...req.body })
  resp.status(StatusCodes.OK).send({ job })
}

const getJob = async (req, resp) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.find({ _id: jobId, createdBy: userId })

  if (!job) {
    throw new NotFoundError(`No Job found with the id : ${jobId} `)
  }

  resp.status(StatusCodes.OK).json({ job })
}

const updateJob = async (req, resp) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req

  if (!company || !position) {
    throw new BadRequestError('company or position cant be empty values')
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )

  if (!job) {
    throw new NotFoundError(`No Job found with the id : ${jobId} `)
  }

  resp.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, resp) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findByIdAndRemove({ _id: jobId, createdBy: userId })

  if (!job) {
    throw new NotFoundError(`No Job found with the id : ${jobId} `)
  }

  resp
    .status(StatusCodes.OK)
    .json({ status: 'success', msg: 'Job is successfully deleted' })
}

module.exports = { getAllJobs, createJob, getJob, updateJob, deleteJob }
