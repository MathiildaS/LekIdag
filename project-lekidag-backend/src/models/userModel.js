/**
 * @file Defines a schema for a user.
 * @module models/userModel.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { DEFAULT_SCHEMA } from './defaultSchema.js'

// Create a schema for a user.
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true, // Must add a first name.
    trim: true // Remove spaces before and after.
  },
  lastName: {
    type: String,
    required: true, // Must add a last name.
    trim: true // Remove spaces before and after.
  },
  username: {
    type: String,
    required: true, // Must add a username.
    trim: true, // Remove spaces before and after.
    minlength: 5, // Minimum length of characters.
    maxlength: 20, // Maximum length of characters.
    unique: true // Only one user with the name.
  },
  password: {
    type: String,
    required: true, // Must add a password.
    minlength: 10, // Minimum length of characters.
    maxlength: 100 // Maximum length of characters.
  },
  email: {
    type: String,
    required: true, // Must add an email.
    unique: true, // Only one user with the name.
    lowercase: true, // Only use lowercase.
    trim: true, // Remove spaces before and after.
    match: [/^\S+@\S+\.\S+$/, 'Ange en giltig e-postadress'] // Must include domain and name, no spaces, @ and .
  },
  refreshToken: {
    type: String,
    default: null
  }
})

/**
 * Authenticate user by verifying username and password.
 *
 * @param {string} username - The provided username.
 * @param {string} password - The provided password.
 * @returns {object} The user document if authentication succeeds.
 * @throws {Error} Error message and status code if authentication fails.
 */
userSchema.statics.auth = async function (username, password) {
  // Find and collect the user based on username
  const user = await this.findOne({ username })

  // Create a dummy hash to prevent timing-attacks if user doesn't exist.
  const dummyHash = await bcrypt.hash(password, 10)

  // If a user exist, use the registered password, otherwise the dummy hash-password.
  const storedPassword = user ? user.password : dummyHash

  // Compare provided password with stored or dummy hashed password.
  const passwordMatch = await bcrypt.compare(password, storedPassword)

  // Throw new error if no found match of username or password.
  if (!user || !passwordMatch) {
    const error = new Error('Login failed. Please try again.')
    error.status = 401 // Unauthorized
    throw error
  }

  return user
}

// A middleware before saving the user.
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) { // Hash password if change of password.
    this.password = await bcrypt.hash(this.password, 10) // Hash password and salt 10 times.
  }
  next() // Continue and save document containing user with password.
})

// Add default schema.
userSchema.add(DEFAULT_SCHEMA)

// Create a UserModel using the schema.
export const UserModel = mongoose.model('User', userSchema)
