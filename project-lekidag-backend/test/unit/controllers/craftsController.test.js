/**
 * @file A unit test for recieving a craft from MongoDB Atlas and confirm error message if database is empty.
 * @module test/unit/controllers/craftsController.test.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */
import { CraftsController } from '../../../src/controllers/api/v1/craftsController.js'
import { CraftModel } from '../../../src/models/craftModel.js'
import { jest } from '@jest/globals'

// Mock the craftModel to avoid connection to MongoDB Atlas during the test.
jest.mock('../../../src/models/craftModel.js')

// Simulate Express req, res, next to test the controller without Express.
describe('CraftsController', () => {
  let testReq,
    testRes,
    testNext

  // Before each test, simulate a GET-req with values of age and location.
  beforeEach(() => {
    testReq = {
      query: { age: '4-5', location: 'Utomhus' }
    }

    // Simulate the response object.
    testRes = {
      status: jest.fn().mockReturnThis(), // Return the testRes in status() to prevent error.
      json: jest.fn() // A fake json() to simulate the JSON response
    }

    // Simulate the next function
    testNext = jest.fn()
  })

  // Describe a test
  test('a craft should be returned with a title, instruction and status code 200', async () => {
    // Simulate a craft/document from the database.
    const testCrafts = [
      {
        title: 'Naturtavla',
        instructions: '1. Klipp till en bit kartong och täck ena sidan med dubbelhäftande tejp. 2. Låt barnet samla små naturföremål: löv, blommor, barr. 3. Låt barnet trycka fast sina fynd på tavlan. 4. När tavlan är klar kan barnet rita något runtomkring eller skriva sitt namn.',
        age: '4-5',
        location: 'Utomhus'
      }
    ]

    // Mock CraftModel.find() and return the testCrafts
    CraftModel.find = jest.fn().mockResolvedValue(testCrafts)

    // New CraftsController instance.
    const craftsController = new CraftsController()

    // Call the getRandomCraft-method with the simulated req, res and next values.
    await craftsController.getRandomCraft(testReq, testRes, testNext)

    // Check that the response status is 200.
    expect(testRes.status).toHaveBeenCalledWith(200)

    // Check that the response is the first craft in the list of crafts in the database.
    expect(testRes.json).toHaveBeenCalledWith({
      title: 'Naturtavla',
      instructions: '1. Klipp till en bit kartong och täck ena sidan med dubbelhäftande tejp. 2. Låt barnet samla små naturföremål: löv, blommor, barr. 3. Låt barnet trycka fast sina fynd på tavlan. 4. När tavlan är klar kan barnet rita något runtomkring eller skriva sitt namn.'
    })
  })

  // Description of the test.
  test('error message when no matching craft is found and status code 404', async () => {
    // Return an empty array which means no documents in the database
    CraftModel.find = jest.fn().mockResolvedValue([])

    // New CraftsController instance.
    const craftsController = new CraftsController()

    // Call the getRandomCraft-method with the simulated req, res and next values.
    await craftsController.getRandomCraft(testReq, testRes, testNext)

    // When trying to access index 0 of the list, an error message will be shown with the status code 404.
    expect(testRes.status).toHaveBeenCalledWith(404)
    expect(testRes.json).toHaveBeenCalledWith({ message: 'No matching craft found' })
  })
})
