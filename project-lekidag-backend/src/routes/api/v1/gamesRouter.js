/**
 * @file Defines the games router.
 * @module routes/api/v1/gamesRouter.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import express from 'express'
import { GamesController } from '../../../controllers/api/v1/gamesController.js'

export const router = express.Router()
const gamesController = new GamesController()

// GET /api/v1/games/random
router.get('/games/random', (req, res, next) => gamesController.getRandomGame(req, res, next))
