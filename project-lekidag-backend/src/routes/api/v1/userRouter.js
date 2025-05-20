/**
 * @file Defines the user router.
 * @module routes/api/v1/userRouter.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import express from 'express'
import { UserController } from '../../../controllers/api/v1/userController.js'
import { JWT } from '../../../middlewares/auth.js'

export const router = express.Router()
const userController = new UserController()
const jwt = new JWT()

// GET /api/v1/user/register
router.post('/user/register', (req, res, next) => userController.registerUser(req, res, next))

// GET /api/v1/user/login
router.post('/user/login', (req, res, next) => userController.loginUser(req, res, next))

// GET /api/v1/user/refresh
router.post('/user/refresh', (req, res, next) => userController.getNewToken(req, res, next))

// GET /api/v1/user/password
router.put('/user/password', jwt.authToken, (req, res, next) => userController.changePassword(req, res, next))

// GET /api/v1/user/email
router.put('/user/email', jwt.authToken, (req, res, next) => userController.changeEmail(req, res, next))

// GET /api/v1/user/logout
router.post('/user/logout', jwt.authToken, (req, res, next) => userController.logoutUser(req, res, next))

// GET /api/v1/user/delete
router.delete('/user/delete', jwt.authToken, (req, res, next) => userController.deleteUser(req, res, next))
