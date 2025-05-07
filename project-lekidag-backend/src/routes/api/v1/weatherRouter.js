/**
 * @file Defines the weather router.
 * @module routes/api/v1/weatherRouter.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import express from 'express'
import { WeatherController } from '../../../controllers/api/v1/weatherController.js'

export const router = express.Router()
const weatherController = new WeatherController()

// GET /api/v1/weather/
router.get('/weather', (req, res, next) => weatherController.getCurrentWeather(req, res, next))
