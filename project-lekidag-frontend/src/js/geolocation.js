/**
 * Returns the coordinates of the user using Geolocation API.
 * If no available location, Stockholm is used as fallback.
 *
 * @returns {Promise} The coordinates of the user.
 */
export async function getUserLocation () {
  // The coordinates for Stockholm.
  const sthlm = { lat: 59.3293, lon: 18.0686 }
  // Check if no available geolocation.
  if (!navigator.geolocation) {
    console.log('Geolocation not available')
    return sthlm
  }

  // Return a promise that resolves to the users coordinates.
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      })
    },
    // Fallback to Stockholm.
    (error) => {
      console.log('Geolocation failed', error)
      resolve(sthlm)
    },
    {
      // Request most accurate position, wait before failing and don't allow cached position
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
    )
  })
}
