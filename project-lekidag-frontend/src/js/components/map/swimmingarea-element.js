/**
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 * @version 1.0.0
 */
import { sharedStyles } from '../../../css/shared.js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const swimmingAreaTemplate = document.createElement('template')
swimmingAreaTemplate.innerHTML = `
<style>  
  @import "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  ${sharedStyles}
  :host {
    display: none;
    width: 100%;
  }

  h3, p {
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

  .swimmingarea-map {
    width: 50%;
    height: 60vh;
    margin: 2rem auto;
    position: relative;
    border: 2px solid #f5a623;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

</style>
<h3>Var finns närmaste badplats?</h3>
<p>Nedan ser ni en karta som visar lekplatser inom en radie på 2 km från er nuvarande plats.<br>
Ni kan också söka manuellt efter en annan plats om ni vill upptäcka badplatser någon annanstans.</p>
<div class="search-container">
  <input type="text" placeholder="Sök efter din plats..." class="search-input"/>
  <button class="search-button styled-button">Sök!</button>
</div>
<div class="swimmingarea-map"></div>
<div class="popup">
  <p class="popup-text"></p>
</div>
`
// Manually set Leaflet default marker icon and shadow
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

customElements.define('swimmingarea-element',
  /**
   * A web component that fetches and displays a map with the nearest swimming areas.
   */
  class extends HTMLElement {
    /**
     * Create a shadow DOM for the swimmingarea-element and attach the template to its shadow root.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(swimmingAreaTemplate.content.cloneNode(true))

      this.abortController = null

      // Reference to the element in the shadow DOM.
      this.swimmingAreaMap = this.shadowRoot.querySelector('.swimmingarea-map')
      this.searchInput = this.shadowRoot.querySelector('.search-input')
      this.searchButton = this.shadowRoot.querySelector('.search-button')
      this.popup = this.shadowRoot.querySelector('.popup')
      this.popupText = this.shadowRoot.querySelector('.popup-text')

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
              this.showPopup('Visar plats..')
              // Display the map with the found coordinates of the searched position.
              this.displayMap({ lat: Number(lat), lon: Number(lon) })
            } else {
              // Display error message if no position could be found.
              this.showPopup('Platsen kunde inte hittas.')
            }
          } catch (error) {
            // Display error message if fail when searching.
            this.showPopup('Fel vid sökning. Försök igen.')
          }
        }
      })
      // Listen for 'Enter'-key and search for the position.
      this.searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          this.searchButton.click()
        }
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
      if (this.abortController) {
        this.abortController.abort()
      }

      this.abortController = new AbortController()
      const signal = this.abortController.signal

      // Mark this position as the one the user just requested.
      const requestedCoords = `${lat},${lon}`
      this.currentTargetCoords = requestedCoords

      this.showPopup('Hämtar badplatser. Det kan ta en liten stund..')

      if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
        this.showPopup('Kunde inte visa kartan.')
        return
      }

      try {
        if (!this.theMap) {
        // Create a Leaflet map and attach it to the DOM-element "this.playgroundMap"
        // Center the map around the users coordinates and with a 15 level zoom.
          this.theMap = L.map(this.swimmingAreaMap).setView([lat, lon], 15)

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

        // Display found swimming areas on map.
        await this.displaySwimmingAreas(lat, lon, signal)

        if (this.currentTargetCoords !== requestedCoords) {
          return
        }

        setTimeout(() => {
          this.theMap.invalidateSize()
        }, 200)
      } catch (error) {
        this.showPopup('Ett fel uppstod när kartan skulle visas.')
      }
    }

    /**
     * Fetches and displays markers for all found swimming areas nearby the user.
     *
     * @param {number} lat Latitude coordinate of the user.
     * @param {number} lon Longitude coordinate of the user.
     * @param {AbortSignal} signal Used to abort fetch-calls.
     */
    async displaySwimmingAreas (lat, lon, signal) {
      try {
        // API URL-build based on enviroment.
        let theUrl = ''
        if (import.meta.env.MODE === 'development') {
          theUrl = `http://localhost:5000/api/v1/swimmingareas?lat=${lat}&lon=${lon}`
        } else {
          theUrl = `https://cscloud8-46.lnu.se/api/v1/swimmingareas?lat=${lat}&lon=${lon}`
        }

        // Fetch data of swimming areas from backend.
        const getSwimmingAreas = await fetch(theUrl, { signal })
        const swimmingAreas = await getSwimmingAreas.json()

        // Create map bounds to include found swimming areas.
        const bounds = L.latLngBounds([lat, lon])

        // Iterate through all found swimming areas and create markers to add on the map.
        for (const swimmingArea of swimmingAreas) {
          const name = swimmingArea.nameOfSwimmingArea || 'Badplats'
          const address = swimmingArea.address || 'Okänd adress'
          const placeLat = swimmingArea.lat
          const placeLon = swimmingArea.lon

          // Create pop-ups for found swimming areas and include the name, address and direction-link to the swimming area.
          const swimmingAreaPopUp = document.createElement('div')
          const nameSwimmingArea = document.createElement('strong')
          nameSwimmingArea.textContent = name
          swimmingAreaPopUp.appendChild(nameSwimmingArea)

          swimmingAreaPopUp.appendChild(document.createElement('br'))

          const addressSwimmingArea = document.createElement('small')
          addressSwimmingArea.textContent = address
          swimmingAreaPopUp.appendChild(addressSwimmingArea)

          swimmingAreaPopUp.appendChild(document.createElement('br'))

          const directionLink = document.createElement('a')
          directionLink.textContent = 'Vägbeskrivning'
          directionLink.href = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lon}&destination=${placeLat},${placeLon}`
          directionLink.target = '_blank'
          directionLink.rel = 'noopener noreferrer' // Security
          swimmingAreaPopUp.appendChild(directionLink)

          bounds.extend([placeLat, placeLon])

          // Add each marker to the map.
          L.marker([placeLat, placeLon])
            .addTo(this.theMap)
            .bindPopup(swimmingAreaPopUp)
        }

        // Adjust the view of the map to include all markers with padding.
        this.theMap.fitBounds(bounds, {
          padding: [60, 60],
          maxZoom: 17
        })
      } catch (error) {
        this.showPopup('Kunde inte hämta badplatser. Uppdatera sidan för att försöka igen.')
      }
    }

    /**
     * Displays a pop-up message with information for the user.
     *
     * @param {string} text - The message that will be displayed for the user.
     */
    showPopup (text) {
      this.popupText.textContent = text
      this.popup.classList.add('display')

      setTimeout(() => {
        this.popup.classList.remove('display')
      }, 2000)
    }

    /**
     * Called when the component is removed from the DOM,
     * cancels ungoing fetch requests using the AbortControllers abort-method.
     */
    disconnectedCallback () {
      if (this.abortController) {
        this.abortController.abort()
      }
    }
  })
