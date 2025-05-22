/**
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 * @version 1.0.0
 */
import { sharedStyles } from '../../../css/shared.js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const playgroundsTemplate = document.createElement('template')
playgroundsTemplate.innerHTML = `
<style>  
  @import "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  ${sharedStyles}
  :host {
    display: none;
    width: 100%;
  }

  p {
    text-align: center;
  }

  .search-container {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    gap: 0.5rem;
  }

  .search-input {
    padding: 0.8rem 1rem;
    font-size: 0.8rem;
    border: 1px solid #E89E69;
    border-radius: 12px;
    background-color: #fffef9;
    color: #E89E69;
    font-family: "DynaPuff", cursive;
  }

  .search-input::placeholder {
    color: #E89E69;
    opacity: 0.7;
  }

  .search-input:focus {
    outline: none;
    border-color: #f5a623;
    box-shadow: 0 0 5px #f5a623;
  }

  .search-button {
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  .playgrounds-map {
    width: 50%;
    height: 60vh;
    margin: 2rem auto;
    position: relative;
    border: 2px solid #f5a623;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .error {
    display: none;
    color:rgb(224, 116, 116);
    text-align: center;
  }

</style>
<p>Använd gärna en mobil enhet med GPS för bästa resultat.</p>
<div class="search-container">
  <input type="text" placeholder="Sök efter din plats..." class="search-input"/>
  <button class="search-button styled-button">Sök!</button>
</div>
<div class="playgrounds-map"></div>
<p class="error"></p>
`
// Fix marker icon not showing in production
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

customElements.define('playgrounds-element',
  /**
   * A web component that fetches and displays a map with the nearest playgrounds.
   */
  class extends HTMLElement {
    /**
     * Create a shadow DOM for the playgrounds-element and attach the template to its shadow root.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(playgroundsTemplate.content.cloneNode(true))

      // Creates a new AbortController object instance to make it possible to remove event listeners.
      this.abortController = new AbortController()

      // Reference to the element in the shadow DOM.
      this.playgroundMap = this.shadowRoot.querySelector('.playgrounds-map')
      this.searchInput = this.shadowRoot.querySelector('.search-input')
      this.searchButton = this.shadowRoot.querySelector('.search-button')
      this.error = this.shadowRoot.querySelector('.error')
      this.theMap = null
      this.fetch = null
    }

    /**
     * Called when added to the DOM.
     * Add EventListeners and listen for click on search button or Enter-key to search for a position on the map.
     */
    connectedCallback () {
      // Listen for click on the search button.
      this.searchButton.addEventListener('click', async () => {
        const searchText = this.searchInput.value.trim()

        // Check if added text in the input field.
        if (searchText) {
          try {
            // Send the search query to Nominatim, encode it.
            const searchLocation = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`)

            // Parse the response.
            const foundLocation = await searchLocation.json()

            // Check the lenght of the response to confirm found positions.
            if (foundLocation.length > 0) {
              // Collect the first found position.
              const { lat, lon } = foundLocation[0]
              this.error.style.display = 'none'
              // Display the map with the found coordinates of the searched position.
              this.displayMap({ lat: Number(lat), lon: Number(lon) })
            } else {
              // Display error message if no position could be found.
              this.error.textContent = 'Platsen kunde inte hittas.'
              this.error.style.display = 'block'
            }
          } catch (error) {
            // Display error message if fail when searching.
            this.error.textContent = 'Fel vid sökning. Försök igen.'
            this.error.style.display = 'block'
          }
        }
        // Listen for 'Enter'-key and search for the position.
        this.searchInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            this.searchButton.click()
          }
        })
      })
    }

    /**
     * Display a Leaflet-map based on the position of the user.
     * Call displayPlaygrounds() to add markers for each found playground on the map.
     *
     * @param {object} coordinates - The user's coordinates.
     * @param {number} coordinates.lat - Latitude.
     * @param {number} coordinates.lon - Longitude.
     */
    async displayMap ({ lat, lon }) {
      // Mark this position as the one the user just requested.
      const requestedCoords = `${lat},${lon}`
      this.currentTargetCoords = requestedCoords

      // Avbryt pågående fetch
      if (this.mapFetchController) {
        this.mapFetchController.abort()
      }

      this.mapFetchController = new AbortController()
      const signal = this.mapFetchController.signal

      if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
        this.error.textContent = 'Kunde inte visa kartan.'
        this.error.style.display = 'block'
        return
      }

      try {
        if (!this.theMap) {
        // Create a Leaflet map and attach it to the DOM-element "this.playgroundMap"
        // Center the map around the users coordinates and with a 15 level zoom.
          this.theMap = L.map(this.playgroundMap).setView([lat, lon], 15)

          // Add OpenStreetMap tiles to the map.
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(this.theMap)
        } else {
          this.theMap.setView([lat, lon], 15)

          // Remove previous added markers, but keep the tiles.
          this.theMap.eachLayer(layer => {
            if (layer instanceof L.Marker) this.theMap.removeLayer(layer)
          })
        }

        // Create the user position marker.
        this.userPosition = L.marker([lat, lon])
          .addTo(this.theMap)
          .bindPopup('Du är här!') // Display a pop-up when clicked on.
          .openPopup() // Open pop-up.

        // Display found playgrounds on map.
        await this.displayPlaygrounds(lat, lon, signal)

        if (this.currentTargetCoords !== requestedCoords) {
          console.log('New searched position.')
          return
        }

        setTimeout(() => {
          this.theMap.invalidateSize()
        }, 200)
      } catch (error) {
        console.error('Kartan kunde inte visas:', error)
        this.error.textContent = 'Ett fel uppstod när kartan skulle visas.'
        this.error.style.display = 'block'
      }
    }

    /**
     * Fetches and displays markers for all found playgrounds nearby the user.
     *
     * @param {number} lat Latitude coordinate of the user.
     * @param {number} lon Longitude coordinate of the user.
     * @param {AbortSignal} signal Used to abort fetch-calls.
     */
    async displayPlaygrounds (lat, lon, signal) {
      try {
        // Hide error message.
        this.error.textContent = ''
        this.error.style.display = 'none'

        // API URL-build based on enviroment.
        let theUrl = ''
        if (import.meta.env.MODE === 'development') {
          theUrl = `http://localhost:5000/api/v1/playgrounds?lat=${lat}&lon=${lon}`
        } else {
          theUrl = `https://cscloud8-46.lnu.se/api/v1/playgrounds?lat=${lat}&lon=${lon}`
        }

        // Fetch data of playgrounds from backend.
        const getPlaygrounds = await fetch(theUrl, { signal })
        const playgrounds = await getPlaygrounds.json()

        // Create map bounds to include found playgrounds.
        const bounds = L.latLngBounds([lat, lon])

        // Iterate through all found playgrounds and create markers to add on the map.
        for (const playground of playgrounds) {
          const name = playground.nameOfPlayground || 'Lekplats'
          const address = playground.address || 'Okänd adress'
          const placeLat = playground.lat
          const placeLon = playground.lon

          // Create pop-ups for found playgrounds and include the name, address and direction-link to the playground.
          const playgroundPopUp = document.createElement('div')
          const namePlayground = document.createElement('strong')
          namePlayground.textContent = name
          playgroundPopUp.appendChild(namePlayground)

          playgroundPopUp.appendChild(document.createElement('br'))

          const addressPlayground = document.createElement('small')
          addressPlayground.textContent = address
          playgroundPopUp.appendChild(addressPlayground)

          playgroundPopUp.appendChild(document.createElement('br'))

          const directionLink = document.createElement('a')
          directionLink.textContent = 'Vägbeskrivning'
          directionLink.href = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lon}&destination=${placeLat},${placeLon}`
          directionLink.target = '_blank'
          directionLink.rel = 'noopener noreferrer' // Security
          playgroundPopUp.appendChild(directionLink)

          bounds.extend([placeLat, placeLon])

          // Add each marker to the map.
          L.marker([placeLat, placeLon])
            .addTo(this.theMap)
            .bindPopup(playgroundPopUp)
        }

        // Adjust the view of the map to include all markers with padding.
        this.theMap.fitBounds(bounds, {
          padding: [60, 60],
          maxZoom: 17
        })
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }
        console.error('Kunde inte hämta lekplatser:', error)
        this.error.textContent = 'Kunde inte hämta lekplatser. Uppdatera sidan för att försöka igen.'
        this.error.style.display = 'block'
      }
    }

    /**
     * Called when the component is removed from the DOM,
     * cancels ungoing fetch requests using the AbortControllers abort-method.
     */
    disconnectedCallback () {
      this.abortController.abort()
    }
  })
