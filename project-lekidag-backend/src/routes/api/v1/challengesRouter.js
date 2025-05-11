/**
 * @file Defines the challenges router.
 * @module routes/api/v1/challengesRouter.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import express from 'express'
import { ChallengesController } from '../../../controllers/api/v1/challengesController.js'

export const router = express.Router()
const challengesController = new ChallengesController()

// GET /api/v1/challenges/random
router.get('/challenges/random', (req, res, next) => challengesController.getRandomChallenge(req, res, next))
