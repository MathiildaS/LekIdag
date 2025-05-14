// jest.setup.js
import fetchMock from 'jest-fetch-mock'

// Override native fetch with jest-fetch-mock manually
global.fetch = fetchMock

// Activate the mock.
fetchMock.enableMocks()
