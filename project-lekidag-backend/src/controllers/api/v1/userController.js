/**
 * @file Defines the UserController class.
 * @module controllers/api/v1/userController.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import bcrypt from 'bcrypt'
import { UserModel } from '../../../models/userModel.js'
import jwt from 'jsonwebtoken'
import { logger } from '../../../config/winston.js'
import fs from 'fs'
import path from 'path'

const privateKeyPath = path.resolve('keys/private.pem')
const publicKeyPath = path.resolve('keys/public.pem')

const privateKey = fs.readFileSync(privateKeyPath, 'utf8')
const publicKey = fs.readFileSync(publicKeyPath, 'utf8')

/**
 * Encapsulates a controller for handling register of a user, login and logout.
 */
export class UserController {
  /**
   * Handles the registration of a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async registerUser (req, res, next) {
    try {
    // Collect the username, password, email, firstName and lastName from the request body.
      const { username, password, email, firstName, lastName } = req.body

      // Validate that no field is missing.
      if (!username || !password || !email || !firstName || !lastName) {
        res.status(400).json({ error: 'Missing required fields' })
        return
      }

      // Check if provided username or email already exist in database.
      const checkUsername = await UserModel.findOne({ username })
      const checkEmail = await UserModel.findOne({ email })

      if (checkUsername) {
        res.status(409).json({ error: 'This username is already taken' })
        return
      } else if (checkEmail) {
        res.status(409).json({ error: 'This e-mail is already in use' })
        return
      }

      // Create new UserModel instance with provided information.
      const newUser = new UserModel({ username, password, email, firstName, lastName })
      // Save it to the database.
      await newUser.save()

      res.status(201).json({ message: 'New user registered successfully!' })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Handles the login of a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async loginUser (req, res, next) {
    try {
      logger.silly('Login user', { body: req.body })

      const { username, password } = req.body

      // Check that username and password is provided.
      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' })
        return
      }

      // Autenthenticate the user by calling the auth-method in UserModel.
      const theUser = await UserModel.auth(username, password)

      // Create the payload to be included in the JWT.
      const jwtPayload = {
        id: theUser._id,
        username: theUser.username
      }

      // Create and sign the JWT access token.
      const accessToken = jwt.sign(jwtPayload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '10m'
      })

      // Create and sign the JWT refresh token.
      const refreshToken = jwt.sign(jwtPayload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '7d'
      })

      theUser.refreshToken = refreshToken
      await theUser.save()

      res.status(200).json({ message: 'Login successful!', accessToken, refreshToken })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Generate a new JWT access token when the old has expired.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getNewToken (req, res, next) {
    try {
      const { refreshToken } = req.body

      // Error handling if no refresh token provided.
      if (!refreshToken) {
        res.status(401).json({ message: 'No refresh token' })
        return
      }

      // Verify the refresh token with the public key.
      const decodedToken = jwt.verify(refreshToken, publicKey, {
        algorithm: 'RS256'
      })

      // The payload to be included in the new JWT access token.
      const jwtPayload = {
        id: decodedToken.id,
        username: decodedToken.username
      }

      // Check if the refresh token is saved with the user in the database.
      const theUser = await UserModel.findById(decodedToken.id)
      if (!theUser || theUser.refreshToken !== refreshToken) {
        res.status(401).json({ message: 'Invalid refresh token' })
        return
      }

      // Create and sign new JWT access token with payload.
      const newAccessToken = jwt.sign(jwtPayload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '10m'
      })

      // Send the new JWT to the client.
      res.status(200).json({ accessToken: newAccessToken })
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        error.status = 401
        error.message = 'Refresh token expired.'
      }
      next(error)
    }
  }

  /**
   * Update user with new password.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async changePassword (req, res, next) {
    try {
      // Collect the id of the user.
      const userId = req.user.id

      // Collect the provided passwords in req.body.
      const { oldPassword, newPassword } = req.body

      if (!oldPassword || !newPassword) {
        res.status(400).json({ message: 'Missing required fields.' })
        return
      }

      // Find the user in the database based on id.
      const theUser = await UserModel.findById(userId)

      // Check if user exist
      if (!theUser) {
        res.status(400).json({ message: 'Could not find user.' })
        return
      }

      // Compare the old password with the saved password to be able to change it.
      const passwordMatch = await bcrypt.compare(oldPassword, theUser.password)

      if (!passwordMatch) {
        res.status(401).json({ message: 'Incorrect password.' })
        return
      }

      // Change password and save it.
      theUser.password = newPassword
      await theUser.save()

      res.status(200).json({ message: 'Password updated successfully.' })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update user with new email.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async changeEmail (req, res, next) {
    try {
      // Collect the id of the user.
      const userId = req.user.id

      // Collect the provided email in req.body.
      const { newEmail } = req.body

      if (!newEmail) {
        res.status(400).json({ message: 'Missing required field.' })
        return
      }

      // Find the user in the database based on id.
      const theUser = await UserModel.findById(userId)

      // Check if user exist
      if (!theUser) {
        res.status(400).json({ message: 'Could not find user.' })
        return
      }

      const addEmail = await UserModel.findOne({ email: newEmail })

      if (addEmail) {
        res.status(409).json({ message: 'Email already in use.' })
        return
      }

      // Change email and save it.
      theUser.email = newEmail
      await theUser.save()

      res.status(200).json({ message: 'Email updated successfully.' })
    } catch (error) {
      next(error)
    }
  }

  /**
   * LogOut a logged in user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async logoutUser (req, res, next) {
    try {
      const userId = req.user.id

      // Find the user in the database based on id.
      const theUser = await UserModel.findById(userId)

      // Check if user exist
      if (!theUser) {
        res.status(400).json({ message: 'Could not find user.' })
        return
      }

      // Delete saved refresh token.
      theUser.refreshToken = null
      await theUser.save()

      res.status(200).json({ message: 'Logged out successfully.' })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete a registered user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteUser (req, res, next) {
    try {
      const userId = req.user.id
      await UserModel.findByIdAndDelete(userId)

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
