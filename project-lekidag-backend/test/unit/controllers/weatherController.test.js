/**
 * @file A unit test to confirm error message if weather can't be fetched.
 * @module test/unit/controllers/weatherController.test.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */
import { WeatherController } from '../../../src/controllers/api/v1/weatherController.js'
import { jest } from '@jest/globals'
import fetchMock from 'jest-fetch-mock'

// Activate mocking of fetch calls before test.
fetchMock.enableMocks()

// Describe the testing and reset all mocks before test.
describe('WeatherController', () => {
  let testReq,
    testRes,
    testNext

  beforeEach(() => {
    fetch.resetMocks()

    // Before each test, simulate a GET-req with coordinates for Stockholm.
    testReq = {
      query: {
        lat: '59.3327',
        lon: '18.0656'
      }
    }

    // Simulate the response object.
    testRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    // Simulate the next function
    testNext = jest.fn()
  })

  // Describe test if error when fetching the weather from OpenWeatherMap.
  test('should return new Error with message and status code 404', async () => {
    // Mock the fetch to throw new Error when fetch call to OpenWeatherMap.
    const error = new Error('Something went wrong when fetching the weather')
    error.status = 404
    fetch.mockReject(error)

    // Create new Weather Controller class-instance.
    const weatherController = new WeatherController()
    // Call the getCurrentWeather-method with the simulated req, res, next values.
    await weatherController.getCurrentWeather(testReq, testRes, testNext)

    // Check that next function is called with the Error-object.
    expect(testNext).toHaveBeenCalledWith(expect.any(Error))

    // Check that the Error contains the correct message and status code.
    expect(testNext.mock.calls[0][0].message).toBe('Something went wrong when fetching the weather')
    expect(testNext.mock.calls[0][0].status).toBe(404)
  })
})
