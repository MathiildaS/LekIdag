/**
 * Handles fetch request with access token and refresh token.
 *
 * @param {string} url - The URL to send the request to.
 * @param {object} data - The fetch data (method, headers, body etc).
 * @returns {Promise<Response>} The fetch response.
 */
export async function fetchWithTokens (url, data = {}) {
  let theUrl = ''
  if (import.meta.env.MODE === 'development') {
    theUrl = 'http://localhost:5000/api/v1/user/refresh'
  } else {
    theUrl = 'https://cscloud8-46.lnu.se/api/v1/user/refresh'
  }
  const accessToken = sessionStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')

  // Create data.headers and add the accesstoken to Authorization header.
  data.headers = data.headers || {}
  data.headers.Authorization = `Bearer ${accessToken}`

  let response = await fetch(url, data)

  // Try and refresh the access token if the current one is not valid.
  if (response.status === 401 && refreshToken) {
    const tokenResponse = await fetch(theUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    })

    if (tokenResponse.ok) {
      const { accessToken: newAccessToken } = await tokenResponse.json()
      sessionStorage.setItem('accessToken', newAccessToken)

      // Retry the request with the new access token.
      data.headers.Authorization = `Bearer ${newAccessToken}`
      response = await fetch(url, data)
    } else {
      throw new Error('Token renewal failed')
    }
  }
  return response
}
