/**
 * @file Defines the PlaygroundsController class.
 * @module controllers/api/v1/playgroundsController.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import { logger } from '../../../config/winston.js'

/**
 * Encapsulates a controller for collecting and returning a list of all found playgrounds.
 */
export class PlaygroundController {
/**
 * Collects playgrounds from the Overpass API based on given coordinates and within a radius of 1500m.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
  async getPlaygrounds (req, res, next) {
    try {
      // Collect the coordinates and given radius from the query parameters.
      const lat = parseFloat(req.query.lat)
      const lon = parseFloat(req.query.lon)
      const radius = 1000

      logger.info(`Req.query: ${lat}, ${lon}`)

      // Create a query (Overpass) to collect all the nearby playgrounds.
      const findPlaygrounds = `
            [out:json];
            (
              node["leisure"="playground"](around:${radius},${lat},${lon});
              way["leisure"="playground"](around:${radius},${lat},${lon});
              relation["leisure"="playground"](around:${radius},${lat},${lon});
            );
            out center;
          `

      // POST the created query to Overpass API
      const allPlaygrounds = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: findPlaygrounds
      })

      // Send error-message if the fetch fails.
      if (!allPlaygrounds.ok) {
        logger.error('!OK status from Overpass API')
        res.status(404).json({ message: 'Could not fetch the playgrounds' })
        return
      }

      // Parse the response from Overpass.
      const foundPlaygrounds = await allPlaygrounds.json()

      const playgroundsInfo = []

      // Cache addresses, Nominatim policy.
      const cacheAddresses = new Map()

      // Iterate through the list of found playgrounds.
      for (const playground of foundPlaygrounds.elements) {
        // Collect the name or Lekplats as name.
        const nameOfPlayground = playground.tags?.name || 'Lekplats'
        // Collect the coordinates of all types.
        const placeLat = playground.lat || playground.center?.lat
        const placeLon = playground.lon || playground.center?.lon

        // If one playground do not have coordinates, skip it.
        if (!placeLat || !placeLon) {
          logger.info('No available coordinates')
          continue
        }

        let address = ''

        // Save the coordinates as "key".
        const cacheCoords = `${placeLat},${placeLon}`

        // Check if the location already has been displayed.
        if (cacheAddresses.has(cacheCoords)) {
          address = cacheAddresses.get(cacheCoords)
          logger.info(`Address from cache for ${cacheCoords}`)
        } else {
          logger.info(`Looking up address for ${cacheCoords}`)

          // Wait 1 second to follow Nominatim policy
          await this.sleep(1000)

          // Use Nominatim API reverse geocoding to look up addresses for the found coordinates of the playgrounds.
          const playgroundAddress = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${placeLat}&lon=${placeLon}&addressdetails=1&zoom=18`, {
            headers: {
            // Nominatim usage policy.
              'User-Agent': 'LekIdag (student project, ms228qs@student.lnu.se)'
            }
          })

          // Parse the response if the request was successful.
          if (playgroundAddress.ok) {
            const infoAddress = await playgroundAddress.json()

            // If the parsed response contains an address, collect it.
            const a = infoAddress.address
            if (a.road && a.postcode && (a.city || a.town)) {
              address = `${a.road}, ${a.postcode} ${a.city || a.town}`
            } else {
              address = infoAddress.display_name
            }

            // Save the coordinates as key and the address as value.
            cacheAddresses.set(cacheCoords, address)
          }
        }
        // Create an object with all relevant information of the playground.
        const aPlayground = {
          nameOfPlayground,
          lat: placeLat,
          lon: placeLon,
          address
        }

        // Push each object to the list and send it to the client.
        playgroundsInfo.push(aPlayground)
      }
      res.status(200).json(playgroundsInfo)
    } catch (error) {
      next(error)
    }
  }

  /**
   * A helper function to delay the execution for an amount of time.
   *
   * @param {number} time - time to wait in milliseconds.
   * @returns {Promise} A promise that resolves after the given time.
   */
  sleep (time) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve()
      }, time)
    })
  }
}
