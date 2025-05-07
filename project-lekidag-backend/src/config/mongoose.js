/**
 * @file Configuration for mongoose and connection to the MongoDB Atlas database.
 * @module config/mongoose.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import mongoose from 'mongoose'
import { logger } from './winston.js'

/**
 * Using mongoose to connect to a MongoDB database.
 *
 * @param {string} mongoDBConnection The URI string for the MongoDB database.
 * @returns {Promise} Resolves when connection is established.
 */
export const connectMongoDB = async (mongoDBConnection) => {
  // Get the mongoose connection object.
  const mongoDBconnection = mongoose.connection

  // Won't save data that does not match the schema, throws errors instead.
  mongoose.set('strict', 'throw')

  // Only allow queries that match the fields defined in the schema.
  mongoose.set('strictQuery', true)

  // Listen for and log different connection events.
  mongoDBconnection.on('connected', () => logger.info('Mongoose connected to MongoDB.'))
  mongoDBconnection.on('error', (err) => logger.error(`Mongoose connection error: ${err}`))
  mongoDBconnection.on('disconnected', () => logger.info('Mongoose disconnected from MongoDB.'))

  // Close the database connection if the app stops running.
  for (const endConnection of ['SIGINT', 'SIGTERM']) {
    process.on(endConnection, () => {
      (async () => {
        await mongoDBconnection.close()
        console.log(`Mongoose disconnected from MongoDB through ${endConnection}.`)
        process.exit(0)
      })()
    })
  }

  // Connect to the MongoDB database.
  logger.info('Mongoose connecting to MongoDB.')
  return mongoose.connect(mongoDBConnection)
}
