/**
 * @file Configuration for Morgan-logger.
 * @module config/morgan.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import morgan from 'morgan'
import { logger } from './winston.js'

/**
 * Returns an ANSI color code based on the status code from the HTTP request.
 *
 * @param {number} statusCode - The HTTP status code.
 * @returns {number} The color code corresponding to the status code.
 */
const getStatusColor = (statusCode) => {
  if (statusCode >= 500) {
    return 101 // Lightred for server errors.
  } else if (statusCode >= 400) {
    return 103 // Lightyellow for client errors.
  } else if (statusCode >= 300) {
    return 106 // Lightcyan for redirection.
  } else if (statusCode >= 200) {
    return 102 // Lightgreen for success.
  } else {
    return 0 // No color for informational codes or no status.
  }
}

/**
 * Apply the corresponding color to the HTTP status codes.
 *
 * @param {number} statusCode - The HTTP status code.
 * @returns {string} The formatted status code with applied color.
 */
const formatStatus = (statusCode) => {
  // Get status color.
  const theColor = getStatusColor(statusCode)

  // \x1b[30m Color of the text: black, \x1b[${theColor}m Background color based on status code, \x1b[39m Resets the text color, \x1b[49m Resets the background color.
  return `\x1b[30m\x1b[${theColor}m${statusCode}\x1b[39m\x1b[49m`
}

/**
 * Define a custom Morgan token for colored status codes.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {string} The formatted status code with color.
 */
morgan.token('colorOfStatus', (req, res) => {
  // Get the status code if available.
  const statusCode = res.statusCode || 0

  return formatStatus(statusCode)
})

// Export the Morgan request logger with the configurations made.
export const reqLogger = morgan(
  process.env.LOGGER_MORGAN_FORMAT_ADD_REMOTE?.toLocaleLowerCase() === 'true'
    ? ':remote-addr :remote-user :method :url HTTP/:http-version :colorOfStatus :res[content-length] - :response-time ms'
    : ':method :url :colorOfStatus :res[content-length] - :response-time ms',
  {
    stream: {
      /**
       * Writes the formatted message.
       *
       * @param {string} formattedMsg - The message to write.
       */
      write: (formattedMsg) => {
        logger.http(formattedMsg.trim())
      }
    }
  }
)
