/**
 * Returns the coordinates of the user.
 * If no available location, Stockholm is used.
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

  // Return a promise that resolves to the users coordinates or Stockholms coordinates.
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      })
    },
    (error) => {
      console.log('Geolocation failed', error)
      resolve(sthlm)
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0
    }
    )
  })
}
