/**
 * @file Defines a schema for a game.
 * @module models/gameModel.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import mongoose from 'mongoose'
import { DEFAULT_SCHEMA } from './defaultSchema.js'

// Create an game-schema.
const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true,
    enum: ['0-1', '2-3', '4-5', '6-8', '9-12']
  },
  location: {
    type: String,
    required: true
  }
})

// Attach the base schema to the game schema.
gameSchema.add(DEFAULT_SCHEMA)

// Create and export a Mongoose model using the game schema.
export const GameModel = mongoose.model('Game', gameSchema, 'lekar')
