/**
 * @file Configuration for the Winston logger.
 * @module config/winston.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import { addColors, createLogger, format, transports } from 'winston'
import path from 'path'

// Destructuring assignment to be able to use different functions from Winston.
const { colorize, combine, printf, timestamp } = format

// A colorizer-instance to color the logging.
const addLogColor = colorize()

// Defines the colors for the different logging.
addColors({
  info: 'blue',
  warn: 'bold yellow',
  error: 'bold red',
  http: 'bold green',
  debug: 'magenta',
  silly: 'gray',
  verbose: 'cyan'
})

// Where to save logs.
const logFilePath = path.resolve('src/savedLogs/logs.log')

// The base format for the logging.
const baseLogFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' })
)

const consoleLogger = combine(
  baseLogFormat,
  printf(({ timestamp, level, message }) => {
    let colorLevel = level

    // If the level is http, let the status code decide the color.
    if (level === 'http') {
    // Use regular expression to find a three digit number corresponding a status code.
      const statusMatch = message.match(/\b\d{3}\b/)
      // If status code found, convert string to integer.
      if (statusMatch) {
        const status = Number.parseInt(statusMatch[0], 10)

        if (status >= 500) {
          colorLevel = 'error'
        } else if (status >= 400) {
          colorLevel = 'warn'
        } else if (status >= 300) {
          colorLevel = 'verbose'
        } else if (status >= 200) {
          colorLevel = 'http'
        }
      }
    }
    return addLogColor.colorize(colorLevel, `[${timestamp}] ${level.toUpperCase()}: ${message}`)
  })
)

// The logger.
export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'silly',
  transports: [
    new transports.Console({ format: consoleLogger }),
    new transports.File({
      filename: logFilePath,
      level: 'error',
      format: combine(
        baseLogFormat,
        printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
      )
    })
  ]
})
