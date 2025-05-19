/**
 * @file Defines the SwimmingAreaController class.
 * @module controllers/api/v1/swimmingController.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import { logger } from '../../../config/winston.js'

/**
 * Encapsulates a controller for collecting and returning a list of all found swimming areas.
 */
export class SwimmingAreaController {
/**
 * Collects swimming areas from the Overpass API based on given coordinates and within a radius of 1000m.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
  async getSwimmingAreas (req, res, next) {
    try {
      // Collect the coordinates and given radius from the query parameters.
      const lat = parseFloat(req.query.lat)
      const lon = parseFloat(req.query.lon)
      const radius = 2000

      logger.info(`Req.query: ${lat}, ${lon}`)

      // Create a query (Overpass) to collect all the nearby playgrounds.
      const findSwimmingAreas = `
            [out:json];
            (
              node["leisure"="beach_resort"](around:${radius},${lat},${lon});
              node["natural"="water"]["swimming"="yes"](around:${radius},${lat},${lon});
              node["sport"="swimming"](around:${radius},${lat},${lon});
              node["leisure"="bathing_place"](around:${radius},${lat},${lon});

              way["leisure"="beach_resort"](around:${radius},${lat},${lon});
              way["natural"="water"]["swimming"="yes"](around:${radius},${lat},${lon});
              way["sport"="swimming"](around:${radius},${lat},${lon});
              way["leisure"="bathing_place"](around:${radius},${lat},${lon});

              relation["leisure"="beach_resort"](around:${radius},${lat},${lon});
              relation["natural"="water"]["swimming"="yes"](around:${radius},${lat},${lon});
              relation["sport"="swimming"](around:${radius},${lat},${lon});
              relation["leisure"="bathing_place"](around:${radius},${lat},${lon});
            );
            out center;
          `

      // POST the created query to Overpass API
      const allSwimmingAreas = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: findSwimmingAreas
      })

      // Send error-message if the fetch fails.
      if (!allSwimmingAreas.ok) {
        logger.error('Fail when fetching from Overpass API')
        res.status(404).json({ message: 'Could not fetch swimming areas' })
        return
      }

      // Parse the response from Overpass.
      const foundSwimmingAreas = await allSwimmingAreas.json()

      const swimmingAreaInfo = []

      // Cache addresses, Nominatim policy.
      const cacheAddresses = new Map()

      // Iterate through the list of found swimming areas.
      for (const swimmingArea of foundSwimmingAreas.elements) {
        // Collect the name or add Badplats as name.
        const nameOfSwimmingArea = swimmingArea.tags?.name || 'Badplats'
        // Collect the coordinates of all types.
        const placeLat = swimmingArea.lat || swimmingArea.center?.lat
        const placeLon = swimmingArea.lon || swimmingArea.center?.lon

        // If one playground do not have coordinates, skip it.
        if (!placeLat || !placeLon) {
          logger.info('No available coordinates')
          continue
        }

        let address = ''

        // Save the coordinates as "key" for caching.
        const cacheCoords = `${placeLat},${placeLon}`

        // Check if the location already has been fetched.
        if (cacheAddresses.has(cacheCoords)) {
          address = cacheAddresses.get(cacheCoords)
          logger.info(`Address from cache for ${cacheCoords}`)
        } else {
          logger.info(`Looking up address for ${cacheCoords}`)

          // Wait 1 second to follow Nominatim policy (1 request / sec)
          await this.sleep(1000)

          // Use Nominatim API reverse geocoding to look up addresses for the found coordinates of the swimming areas.
          const swimmingAreaAddress = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${placeLat}&lon=${placeLon}&addressdetails=1&zoom=18`, {
            headers: {
            // Nominatim usage policy.
              'User-Agent': 'LekIdag (student project, ms228qs@student.lnu.se)'
            }
          })

          // Parse the response if the request was successful.
          if (swimmingAreaAddress.ok) {
            const infoAddress = await swimmingAreaAddress.json()

            // If the parsed response contains an address, collect and build it.
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
        const aSwimmingArea = {
          nameOfSwimmingArea,
          lat: placeLat,
          lon: placeLon,
          address
        }

        // Push each object to the list and send it to the client.
        swimmingAreaInfo.push(aSwimmingArea)
      }
      res.status(200).json(swimmingAreaInfo)
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
