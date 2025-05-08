/**
 * @file Defines the crafts router.
 * @module routes/api/v1/craftsRouter.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import express from 'express'
import { CraftsController } from '../../../controllers/api/v1/craftsController.js'

export const router = express.Router()
const craftsController = new CraftsController()

// GET /api/v1/crafts/random
router.get('/crafts/random', (req, res, next) => craftsController.getRandomCraft(req, res, next))
