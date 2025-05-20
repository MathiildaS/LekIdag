/**
 * @file This is the start of the application.
 * @module src/server.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

// Import necessary modules and packages.
import httpContext from 'express-http-context'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import http from 'node:http'
import { randomUUID } from 'node:crypto'
import { router } from './routes/router.js'
import { reqLogger } from './config/morgan.js'
import { logger } from './config/winston.js'
import { connectMongoDB } from './config/mongoose.js'

// Creates an Express application-instance.
const expressApp = express()
export { expressApp }

try {
  // Connect to database MongoDB.
  await connectMongoDB(process.env.DB_CONNECTION_STRING)

  // Use helmet for security headers.
  expressApp.use(helmet())

  // Use cors to allow cross-origin requests.
  expressApp.use(cors())

  // Add request-scoped context.
  expressApp.use(httpContext.middleware)

  // Log HTTP-requests.
  expressApp.use(reqLogger)

  // Parse incoming JSON
  expressApp.use(express.json())

  // Trust proxy headers in production mode.
  if (process.env.NODE_ENV === 'production') {
    expressApp.set('trust proxy', 1) // Trust first proxy in production.
  }

  // Middleware to generate a request ID and store the information.
  expressApp.use((req, res, next) => {
    req.requestUuid = randomUUID()
    httpContext.set('request', req)
    next() // Continue to the next middleware.
  })

  // Register the main-route to handle all http-requests.
  expressApp.use('/', router)

  // Middleware for error handling.
  expressApp.use((err, req, res, next) => {
    // Log all errors.
    logger.error(`Error: ${err.message}`, { error: err })

    if (process.env.NODE_ENV === 'production') {
    // Ensure valid status code.
      if (!err.status) {
        err.status = 500
        err.message = http.STATUS_CODES[err.status]
      }

      res
        .status(err.status)
        .json({ status: err.status, message: err.message })
      return
    }

    // Show all error details in development mode.
    const errorInfo = { status: err.status || 500, message: err.message, stack: err.stack }
    return res
      .status(errorInfo.status)
      .json(errorInfo)
  })

  if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 5000
    // Starts the HTTP server listening for connections on given PORT.
    const server = expressApp.listen(port, () => {
      logger.info(`Server running at http://localhost:${server.address().port}`)
    })
  }
} catch (e) {
  logger.error(e.message, { error: e })
  process.exitCode = 1
}
