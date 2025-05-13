/**
 * @file A unit test for recieving a challenge from MongoDB Atlas and confirm error message if database is empty.
 * @module test/unit/controllers/challengesController.test.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */
import { ChallengesController } from '../../../src/controllers/api/v1/challengesController.js'
import { ChallengeModel } from '../../../src/models/challengeModel.js'
import { jest } from '@jest/globals'

// Mock the challengeModel to avoid connection to MongoDB Atlas during the test.
jest.mock('../../../src/models/challengeModel.js')

// Simulate Express req, res, next to test the controller without Express.
describe('ChallengesController', () => {
  let testReq,
    testRes,
    testNext

  // Before each test, simulate a GET-req with values of age.
  beforeEach(() => {
    testReq = {
      query: { age: '6-8' }
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
  test('a challenge should be returned with a title, instruction, solution and status code 200', async () => {
    // Simulate a challenge/document from the database.
    const testChallenges = [
      {
        title: 'Skattjakt i rummet',
        instructions: 'Hitta en sak för varje beskrivning: Något som är runt, något som kan öppnas, något som är blått och något som känns kallt. Lägg alla saker i en hög eller visa upp dem för en vuxen!',
        age: '6-8',
        solution: 'Denna utmaning stimulerar kreativt tänkande. Något som är runt: En boll, ett mynt. Kan öppnas: En burk, en bok. Blått: En penna, en tröja. Kallt: En vattenflaska, en isbit. Läsbart: En tidning, ett mjölkpaket.'
      }
    ]

    // Mock ChallengeModel.find() and return the testChallenges
    ChallengeModel.find = jest.fn().mockResolvedValue(testChallenges)

    // New ChallengesController instance.
    const challengesController = new ChallengesController()

    // Call the getRandomChallenge-method with the simulated req, res and next values.
    await challengesController.getRandomChallenge(testReq, testRes, testNext)

    // Check that the response status is 200.
    expect(testRes.status).toHaveBeenCalledWith(200)

    // Check that the response is the challenge with title, instructions and solution.
    expect(testRes.json).toHaveBeenCalledWith({
      title: 'Skattjakt i rummet',
      instructions: 'Hitta en sak för varje beskrivning: Något som är runt, något som kan öppnas, något som är blått och något som känns kallt. Lägg alla saker i en hög eller visa upp dem för en vuxen!',
      solution: 'Denna utmaning stimulerar kreativt tänkande. Något som är runt: En boll, ett mynt. Kan öppnas: En burk, en bok. Blått: En penna, en tröja. Kallt: En vattenflaska, en isbit. Läsbart: En tidning, ett mjölkpaket.'
    })
  })

  // Description of the test.
  test('error message when no matching challenge is found and status code 404', async () => {
    // Return an empty array which means no documents in the database
    ChallengeModel.find = jest.fn().mockResolvedValue([])

    // New ChallengesController instance.
    const challengesController = new ChallengesController()

    // Call the getRandomChallenge-method with the simulated req, res and next values.
    await challengesController.getRandomChallenge(testReq, testRes, testNext)

    // When trying to access a challenge, an error message will be shown with the status code 404.
    expect(testRes.status).toHaveBeenCalledWith(404)
    expect(testRes.json).toHaveBeenCalledWith({ message: 'No matching challenge found' })
  })
})
