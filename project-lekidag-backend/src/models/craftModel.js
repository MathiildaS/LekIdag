/**
 * @file Defines a schema for a craft.
 * @module models/craftModel.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import mongoose from 'mongoose'
import { DEFAULT_SCHEMA } from './defaultSchema.js'

// Create an craft-schema.
const craftSchema = new mongoose.Schema({
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

// Attach the base schema to the craft schema.
craftSchema.add(DEFAULT_SCHEMA)

// Create and export a Mongoose model using the craft schema.
export const CraftModel = mongoose.model('Craft', craftSchema, 'pyssel')
