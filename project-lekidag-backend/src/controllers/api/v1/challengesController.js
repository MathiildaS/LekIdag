/**
 * @file Defines the ChallengeController class.
 * @module controllers/api/v1/challengesController.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import { ChallengeModel } from '../../../models/challengeModel.js'
import { logger } from '../../../config/winston.js'

/**
 * Encapsulates a controller for collecting and returning a random challenge.
 */
export class ChallengesController {
/**
 * Collects a challenge from the MongoDB Atlas database and sends a response containing all metadata.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
  async getRandomChallenge (req, res, next) {
    try {
    // Collect the age query parameter from the request.
      const { age } = req.query

      const findAChallenge = await ChallengeModel.find({
        age
      })

      logger.debug(`Challenge found: ${findAChallenge.length}`)

      if (findAChallenge.length === 0) {
        res.status(404).json({ message: 'No matching craft found' })
        return
      }

      // Generate a random index/challenge based on the length of the array of challenges/documents.
      const randomChallenge = Math.floor(Math.random() * findAChallenge.length)
      const chosenChallenge = findAChallenge[randomChallenge]

      const challenge = {
        title: chosenChallenge.title,
        instructions: chosenChallenge.instructions,
        solution: chosenChallenge.solution
      }

      res.status(200).json(challenge)
    } catch (error) {
      logger.error(`Failed to get random challenge: ${error.message}`)
      next(error)
    }
  }
}
