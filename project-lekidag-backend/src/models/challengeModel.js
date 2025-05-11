/**
 * @file Defines a schema for a challenge.
 * @module models/challengeModel.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import mongoose from 'mongoose'
import { DEFAULT_SCHEMA } from './defaultSchema.js'

// Create an challenge-schema.
const challengeSchema = new mongoose.Schema({
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
  solution: {
    type: String,
    required: true
  }
})

// Attach the base schema to the challenge schema.
challengeSchema.add(DEFAULT_SCHEMA)

// Create and export a Mongoose model using the challenge-schema.
export const ChallengeModel = mongoose.model('Challenge', challengeSchema, 'utmaningar')
