/**
 * @file Defines the user router.
 * @module routes/api/v1/userRouter.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import express from 'express'
import { UserController } from '../../../controllers/api/v1/userController.js'
import { JWT } from '../../../middlewares/auth.js'
import { check, validationResult } from 'express-validator'

export const router = express.Router()
const userController = new UserController()
const jwt = new JWT()

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

// GET /api/v1/user/register
router.post('/user/register', [
  check('username').trim().escape(),
  check('password').trim().escape(),
  check('email').trim().escape(),
  check('firstName').trim().escape(),
  check('lastName').trim().escape()
],
validate, (req, res, next) => userController.registerUser(req, res, next))

// GET /api/v1/user/login
router.post('/user/login',
  [
    check('username').trim().escape(),
    check('password').trim().escape()
  ],
  validate, (req, res, next) => userController.loginUser(req, res, next))

// GET /api/v1/user/profile
router.get('/user/profile', jwt.authToken, (req, res, next) => userController.getProfile(req, res, next))

// GET /api/v1/user/refresh
router.post('/user/refresh',
  [
    check('refreshToken').trim().escape()
  ],
  validate, (req, res, next) => userController.getNewToken(req, res, next))

// GET /api/v1/user/password
router.put('/user/password', jwt.authToken,
  [
    check('oldPassword').trim().escape(),
    check('newPassword').trim().escape()
  ],
  validate, (req, res, next) => userController.changePassword(req, res, next))

// GET /api/v1/user/email
router.put('/user/email', jwt.authToken,
  [
    check('newEmail').trim().escape()
  ],
  validate, (req, res, next) => userController.changeEmail(req, res, next))

// GET /api/v1/user/logout
router.post('/user/logout', jwt.authToken, (req, res, next) => userController.logoutUser(req, res, next))

// GET /api/v1/user/delete
router.delete('/user/delete', jwt.authToken, (req, res, next) => userController.deleteUser(req, res, next))
