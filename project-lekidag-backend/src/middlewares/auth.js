/**
 * @file Authenticates a request with JWT.
 * @module src/middlewares/auth.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import jwt from 'jsonwebtoken'

const publicKey = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n')

/**
 * Decode and verify the provided Json Web Token and refresh token.
 */
export class JWT {
  /**
   * Middleware to authenticate the Json Web Token.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async authToken (req, res, next) {
    try {
      // Extract and collect the authorization header from the req-object.
      const auth = req.headers.authorization

      // Make sure authorization header is provided.
      if (!auth) {
        res.status(401).json({ message: 'Access token invalid or not provided.' })
        return
      }

      // Split the collected header.
      const splitAuthHeader = auth.split(' ')

      // Get the first part of the header.
      const authKey = splitAuthHeader[0]

      // Make sure only to accept 'Bearer'-tokens.
      if (authKey !== 'Bearer') {
        res.status(401).json({ message: 'Unauthorized!' })
        return
      }

      // Get the second part of the header.
      const authValue = splitAuthHeader[1]

      const decodedUser = jwt.verify(authValue, publicKey, {
        algorithm: 'RS256'
      })

      // Extract and add the decoded user in req.user
      req.user = {
        id: decodedUser.id,
        username: decodedUser.username
      }

      next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        error.status = 401
        error.message = 'Access token expired.'
      }
      next(error)
    }
  }
}
