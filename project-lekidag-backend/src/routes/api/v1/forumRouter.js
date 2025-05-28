/**
 * @file Defines the forum router for creating, reading, updating and deleting forum posts.
 * @module routes/api/v1/forumRouter.js
 * @author Mathilda Segerlund
 */

import express from 'express'
import { ForumController } from '../../../controllers/api/v1/forumController.js'
import { JWT } from '../../../middlewares/auth.js'
import { check, validationResult } from 'express-validator'

export const router = express.Router()
const forumController = new ForumController()

const onlineUser = new JWT()

/**
 * Middleware to handle validation and sanitize inputs.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array() })
    return
  }
  next()
}

// GET /api/v1/forum
router.get('/forum', (req, res, next) => forumController.index(req, res, next))

// GET /api/v1/forum/:id
router.get('/forum/:id', (req, res, next) => forumController.displayPost(req, res, next))

// POST /api/v1/forum
router.post('/forum', onlineUser.authToken,
  [
    check('title').trim().escape().notEmpty().withMessage('Titel krävs.'),
    check('content').trim().escape().notEmpty().withMessage('Innehåll krävs.')
  ],
  validate,
  (req, res, next) => forumController.createPost(req, res, next)
)

// PUT /api/v1/forum/:id
router.put('/forum/:id', onlineUser.authToken,
  [
    check('title').trim().escape().notEmpty().withMessage('Titel krävs.'),
    check('content').trim().escape().notEmpty().withMessage('Innehåll krävs.')
  ],
  validate,
  (req, res, next) => forumController.updatePost(req, res, next)
)

// DELETE /api/v1/forum/:id
router.delete('/forum/:id', onlineUser.authToken,
  (req, res, next) => forumController.deletePost(req, res, next)
)
