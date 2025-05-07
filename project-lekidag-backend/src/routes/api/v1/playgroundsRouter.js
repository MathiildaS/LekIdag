/**
 * @file Defines the playgrounds router.
 * @module routes/api/v1/playgroundsRouter.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import express from 'express'
import { PlaygroundController } from '../../../controllers/api/v1/playgroundsController.js'

export const router = express.Router()
const playgroundController = new PlaygroundController()

// GET /api/v1/playgrounds/
router.get('/playgrounds', (req, res, next) => playgroundController.getPlaygrounds(req, res, next))
