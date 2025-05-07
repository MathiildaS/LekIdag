/**
 * @file Defines the WeatherController class.
 * @module controllers/api/v1/weatherController.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import { logger } from '../../../config/winston.js'

/**
 * Encapsulates a controller for collecting and returning a the current weather.
 */
export class WeatherController {
/**
 * Collects the current weather from the OpenWeatherMap API.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
  async getCurrentWeather (req, res, next) {
    try {
      const { lat, lon } = req.query

      logger.info(`Collecting weather for ${lat} and ${lon}`)

      const apiKey = process.env.OPENWEATHER_API_KEY

      const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=se&appid=${apiKey}`)

      if (!weatherResponse.ok) {
        const error = new Error('Something went wrong when fetching the weather')
        error.status = 404
        throw error
      }

      const currentWeather = await weatherResponse.json()

      const displayWeather = {
        temperature: currentWeather.main.temp,
        weather: currentWeather.weather[0].description,
        iconUrl: `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`,
        location: currentWeather.name
      }

      logger.info(`Weather report ${displayWeather.temperature}`)

      res.status(200).json(displayWeather)
    } catch (error) {
      next(error)
    }
  }
}
