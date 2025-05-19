/**
 * @file Defines the swimming area router.
 * @module routes/api/v1/swimmingRouter.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import express from 'express'
import { SwimmingAreaController } from '../../../controllers/api/v1/swimmingController.js'

export const router = express.Router()
const swimmingAreaController = new SwimmingAreaController()

// GET /api/v1/swimmingareas/
router.get('/swimmingareas', (req, res, next) => swimmingAreaController.getSwimmingAreas(req, res, next))
