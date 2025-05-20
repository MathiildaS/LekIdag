/**
 * @file Defines the API router, version 1.
 * @module routes/api/v1/router.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import express from 'express'
import { router as gamesRouter } from './gamesRouter.js'
import { router as weatherRouter } from './weatherRouter.js'
import { router as playgroundsRouter } from './playgroundsRouter.js'
import { router as craftsRouter } from './craftsRouter.js'
import { router as challengesRouter } from './challengesRouter.js'
import { router as userRouter } from './userRouter.js'
import { router as swimmingRouter } from './swimmingRouter.js'

export const router = express.Router()

// API message.
router.get('/', (req, res) => res.json({ message: 'Welcome to the LekIdag API, version 1!' }))

// Register the route for game-requests.
router.use('/', gamesRouter)

// Register the route for craft-requests.
router.use('/', craftsRouter)

// Register the route for weather-requests.
router.use('/', weatherRouter)

// Register the route for playgrounds-requests.
router.use('/', playgroundsRouter)

// Register the route for swimming area-requests.
router.use('/', swimmingRouter)

// Register the route for challenges-requests.
router.use('/', challengesRouter)

// Register the route for user-requests.
router.use('/', userRouter)
