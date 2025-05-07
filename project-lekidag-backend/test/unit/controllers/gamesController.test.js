/**
 * @file A unit test for recieving a game from MongoDB Atlas.
 * @module test/unit/controllers/gamesController.test.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */
import { GamesController } from '../../../src/controllers/api/v1/gamesController.js'
import { GameModel } from '../../../src/models/gameModel.js'
import { jest } from '@jest/globals'

// Mock the gameModel to avoid connection to MongoDB Atlas during the test.
jest.mock('../../../src/models/gameModel.js')

// Simulate Express req, res, next to test the controller without Express.
describe('GamesController', () => {
  let testReq,
    testRes,
    testNext

  // Before each test, simulate a GET-req with values of age and location.
  beforeEach(() => {
    testReq = {
      query: { age: '9-12', location: 'utomhus' }
    }

    // Simulate the response object.
    testRes = {
      status: jest.fn().mockReturnThis(), // Return the testRes in status() to prevent error.
      json: jest.fn() // A fake json() to simulate the JSON response
    }

    // Simulate the next function
    testNext = jest.fn()
  })

  // Description of the test.
  it('a game should be returned with a status code 200', async () => {
    // Simulate a game/document from the database.
    const testGames = [
      {
        title: 'Ballong race',
        instructions: '1. Dela in deltagarna i par. 2. Ge varje par en uppblåst ballong. Ballongen ska placeras mellan deltagarnas bröstkorgar (eller ryggar). 3. På GÅ ska deltagarna springa mot mål utan att tappa ballongen. Inga händer är tillåtna!',
        age: '9-12',
        location: 'utomhus'
      }
    ]
    // Return the simulated game with the simulated GameModel
    GameModel.find = jest.fn().mockResolvedValue(testGames)

    // New GamesController instance.
    const gamesController = new GamesController()

    // Call the getRandomGame-method with the simulated req, res and next values.
    await gamesController.getRandomGame(testReq, testRes, testNext)

    // Check that the response status is 200.
    expect(testRes.status).toHaveBeenCalledWith(200)

    // Check that the response is the first game in the list of games in the database.
    expect(testRes.json).toHaveBeenCalledWith({
      title: 'Ballong race',
      instructions: '1. Dela in deltagarna i par. 2. Ge varje par en uppblåst ballong. Ballongen ska placeras mellan deltagarnas bröstkorgar (eller ryggar). 3. På GÅ ska deltagarna springa mot mål utan att tappa ballongen. Inga händer är tillåtna!'
    })
  })

  // Description of the test.
  it('error message when no matching game is found and status code 404', async () => {
    // Return an empty array which means no documents in the database
    GameModel.find = jest.fn().mockResolvedValue([])

    // New GamesController instance.
    const gamesController = new GamesController()

    // Call the getRandomGame-method with the simulated req, res and next values.
    await gamesController.getRandomGame(testReq, testRes, testNext)

    // When trying to access index 0 of the list, an error message will be shown with the status code 404.
    expect(testRes.status).toHaveBeenCalledWith(404)
    expect(testRes.json).toHaveBeenCalledWith({ message: 'No matching game found' })
  })
})
