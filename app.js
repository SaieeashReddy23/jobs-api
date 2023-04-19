require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

// extra security packages
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors')
const xssClean = require('xss-clean')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// AuthMiddleware
const AuthMiddleware = require('./middleware/authentication')

//routers
const authRouter = require('./routes/auth')
const JobsRouter = require('./routes/jobs')

// DB
const connectDB = require('./db/connect')

app.use(express.json())
app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
)

// extra packages

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', AuthMiddleware, JobsRouter)

// routes
app.get('/', (req, res) => {
  res.send('jobs api')
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
