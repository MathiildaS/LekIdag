/**
 * @file Defines the GameController class.
 * @module controllers/api/v1/gamesController.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import { GameModel } from '../../../models/gameModel.js'
import { logger } from '../../../config/winston.js'

/**
 * Encapsulates a controller for collecting and returning a random game.
 */
export class GamesController {
/**
 * Collects a game from the MongoDB Atlas database and sends a response containing all metadata.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
  async getRandomGame (req, res, next) {
    try {
      // Collect the age and location query parameters from the request.
      const { age, location } = req.query

      const findAGame = await GameModel.find({
        age,
        location
      })

      logger.debug(`Games found: ${findAGame.length}`)

      if (findAGame.length === 0) {
        res.status(404).json({ message: 'No matching game found' })
        return
      }

      // Generate a random index/game based on the length of the array of games/documents.
      const randomGame = Math.floor(Math.random() * findAGame.length)
      const chosenGame = findAGame[randomGame]

      const game = {
        title: chosenGame.title,
        instructions: chosenGame.instructions
      }

      res.status(200).json(game)
    } catch (error) {
      next(error)
    }
  }
}
