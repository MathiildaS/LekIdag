/**
 * @file Defines the main router.
 * @module routes/router.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import express from 'express'
import http from 'node:http'
import { router as v1Router } from './api/v1/router.js'

export const router = express.Router()

// Register API version 1.
router.use('/api/v1', v1Router)

// Catch 404 errors if wrong routes.
router.use('*', (req, res, next) => {
  const statusCode = 404
  const errorMessage = http.STATUS_CODES[statusCode] || 'Not Found'
  const error = new Error(errorMessage)
  error.status = statusCode

  next(error)
})
