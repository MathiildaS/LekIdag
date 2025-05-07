/**
 * @file Defines a default schema with custom converting options.
 * @module models/defaultSchema.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import mongoose from 'mongoose'
import { logger } from '../config/winston.js'

// Options used when converting a document to a plain object or JSON.
const dataTransformOpt = Object.freeze({
  getters: true, // Include getters and virtual properties when converting.
  versionKey: false, // Exclude the default __v field in the object.
  /**
   * Transforms the document by removing the _id field.
   *
   * @param {object} orgDoc - The original Mongoose document.
   * @param {object} retObj - The converted document.
   * @returns {object} The transformed object without the _id field.
   */
  transform: (orgDoc, retObj) => {
    logger.silly('Document to transform', orgDoc._id)
    retObj.id = retObj._id
    delete retObj._id // Remove the _id field in the object.
    logger.debug('Transformed document', { id: retObj })
    return retObj
  }
})

// Create a default schema with the converting options that will be the base for other schemas.
const defaultSchema = new mongoose.Schema({}, {
  // Add and maintain createdAt and updatedAt fields. Track times.
  timestamps: true,
  toObject: dataTransformOpt,
  toJSON: dataTransformOpt,
  // Optimistic Concurrency Control enabled. Prevent overwriting if data is changed.
  optimisticConcurrency: true
})
// Export the default schema without the possibility to change it.
export const DEFAULT_SCHEMA = Object.freeze(defaultSchema)
