/**
 * @file Defines the GameController class.
 * @module controllers/api/v1/gamesController.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import { CraftModel } from '../../../models/craftModel.js'
import { logger } from '../../../config/winston.js'

/**
 * Encapsulates a controller for collecting and returning a random craft.
 */
export class CraftsController {
/**
 * Collects a craft from the MongoDB Atlas database and sends a response containing all metadata.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
  async getRandomCraft (req, res, next) {
    try {
    // Collect the age and location query parameters from the request.
      const { age, location } = req.query

      const findACraft = await CraftModel.find({
        age,
        location
      })

      logger.debug(`Games found: ${findACraft.length}`)

      if (findACraft.length === 0) {
        res.status(404).json({ message: 'No matching craft found' })
        return
      }

      // Generate a random index/craft based on the length of the array of crafts/documents.
      const randomCraft = Math.floor(Math.random() * findACraft.length)
      const chosenCraft = findACraft[randomCraft]

      const craft = {
        title: chosenCraft.title,
        instructions: chosenCraft.instructions
      }

      res.status(200).json(craft)
    } catch (error) {
      logger.error(`Failed to get random craft: ${error.message}`)
      next(error)
    }
  }
}
