/**
 * @file An integration test for user related routes and endpoints.
 * @module test/integration/routes/userRouter.test.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import request from 'supertest'
import { expressApp } from '../../../src/server.js'
import { UserModel } from '../../../src/models/userModel.js'

describe('userRouter', () => {
  let accessToken = ''
  let refreshToken = ''

  // Create testdata for a user.
  const testUser = {
    username: 'testuser',
    password: 'Password123',
    email: 'testuser@test.com',
    firstName: 'Test',
    lastName: 'User'
  }

  // Create a test for register a new user.
  test('a new user should be registered', async () => {
    // Send POST to user/register endpoint with testdata.
    const res = await request(expressApp)
      .post('/api/v1/user/register')
      .send(testUser)

    if (res.statusCode !== 201) {
      console.log(res.body)
    }

    // Check statuscode and message of the response.
    expect(res.statusCode).toBe(201)
    expect(res.body.message).toBe('Registreringen lyckades!')
  })

  // Create a test for log in a registered user.
  test('a registered user should be able to log in and receive JWT access and refresh tokens', async () => {
    // Send POST to user/login endpoint with username and password.
    const res = await request(expressApp)
      .post('/api/v1/user/login')
      .send({ username: testUser.username, password: testUser.password })

    if (res.statusCode !== 200) {
      console.log(res.body)
    }

    // Check statuscode and that the response contains accessToken and refreshToken. Save them.
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('accessToken')
    expect(res.body).toHaveProperty('refreshToken')
    accessToken = res.body.accessToken
    refreshToken = res.body.refreshToken
  })

  // Create a test for changing password.
  test('a logged in user should be able to change password', async () => {
  // Send PUT-request with old and new password.
    const res = await request(expressApp)
      .put('/api/v1/user/password')
      .set('Authorization', `Bearer ${accessToken}`) // Include JWT access token in the Authorization header.
      .send({ oldPassword: 'Password123', newPassword: 'NewPassword456' })

    if (res.statusCode !== 200) {
      console.log(res.body)
    }

    // Check statuscode and message of the response.
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Lösenord har blivit uppdaterat!')
  })

  // Create a test for changing email.
  test('a logged in user should be able to change email', async () => {
  // Send PUT-request with new email.
    const res = await request(expressApp)
      .put('/api/v1/user/email')
      .set('Authorization', `Bearer ${accessToken}`) // Include JWT access token in the Authorization header.
      .send({ newEmail: 'new@test.com' })

    if (res.statusCode !== 200) {
      console.log(res.body)
    }

    // Check statuscode and message of the response.
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Ny E-post adress registrerad.')
  })

  // Create a test for getting a new access token.
  test('a user should receive a new access token using the refresh token', async () => {
    const res = await request(expressApp)
      .post('/api/v1/user/refresh')
      .send({ refreshToken })

    if (res.statusCode !== 200) {
      console.log(res.body)
    }

    // Check statuscode and that a new access token is provided.
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('accessToken')

    // Update access token to the new one.
    accessToken = res.body.accessToken
  })

  // Create a test for logging out.
  test('a user should be able to log out and invalidate the refresh token', async () => {
    const res = await request(expressApp)
      .post('/api/v1/user/logout')
      .set('Authorization', `Bearer ${accessToken}`) // Include the access token in the Authorization header.

    if (res.statusCode !== 200) {
      console.log(res.body)
    }

    // Check statuscode and message of the response.
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Du har blivit utloggad!')
  })

  // Create a test to verify that the refresh token is invalid after logging out.
  test('a user should not be able to use an old refresh token after logging out', async () => {
    const res = await request(expressApp)
      .post('/api/v1/user/refresh')
      .send({ refreshToken }) // Include the "old" refresh token before logging out.

    if (res.statusCode !== 401) {
      console.log(res.body)
    }

    // Check statuscode and message of the response.
    expect(res.statusCode).toBe(401)
    expect(res.body.message).toBe('Ogiltig refresh token')
  })

  afterAll(async () => {
    await UserModel.deleteOne({ username: testUser.username })
  })
})
