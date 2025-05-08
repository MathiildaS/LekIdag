/**
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 * @version 1.0.0
 */
import { sharedStyles } from '../../../css/shared.js'

const layoutTemplate = document.createElement('template')
layoutTemplate.innerHTML = `
<style>
  ${sharedStyles}
    :host {
      position: absolute;
      top: 5rem;
      right: 6rem;
      z-index: 10;
      display: block;
    }

    .weather-container {
      display: grid;
      grid-template-columns: auto auto;
      align-items: center;
      justify-content: center;
      background-color: #fffef9;
      border-radius: 12px;
      border: 1px solid #E89E69;
      padding: 5px 10px;
      gap: 0.5rem;
    }

    #icon {
      width: 60px;
      height: 60px;
      object-fit: contain;
    }

    .info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .info span {
      display: block;
      color: #E89E69;
      line-height: 1.2;
    }
</style>
<div class="weather-container">
  <div class="info">
  <span id="temp">--</span>
  <span id="text">--</span>
  <span id="location">--</span>
  </div>
  <img id="icon" alt="figure">
</div>
`

customElements.define('weather-element',
  /**
   * Displays the weather.
   */
  class extends HTMLElement {
    /**
     * Create a shadow DOM for the layout-element and attach the template to its shadow root.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(layoutTemplate.content.cloneNode(true))

      // Creates a new AbortController object instance to make it possible to remove event listeners.
      this.abortController = new AbortController()

      // References to the elements in the shadow DOM.
      this.weatherIcon = this.shadowRoot.querySelector('#icon')
      this.weatherTemp = this.shadowRoot.querySelector('#temp')
      this.weatherText = this.shadowRoot.querySelector('#text')
      this.weatherLocation = this.shadowRoot.querySelector('#location')
    }

    /**
     * Call the getTheLocation method to collect the user position when added to the DOM.
     */
    connectedCallback () {
    }

    /**
     * Receives the user's coordinates and fetches the weather for that location.
     *
     * @param {object} coordinates - The user's location in coordinates.
     * @param {number} coordinates.lat - the latitude coordinate.
     * @param {number} coordinates.lon - the longitude coordinate.
     */
    getTheLocation ({ lat, lon }) {
      // Execute fetchTheWeather with found location coordinates.
      this.fetchTheWeather(lat, lon)
    }

    /**
     * Get the weather by fetching it from API with provided coordinates.
     * Update the DOM with the received weather data.
     *
     * @param {number} lat - The latitude coordinate.
     * @param {number} lon - The longitude coordinate.
     * @throws {Error} Status if unable to fetch the weather.
     */
    async fetchTheWeather (lat, lon) {
      let theUrl = ''
      if (import.meta.env.MODE === 'development') {
        theUrl = `http://localhost:5000/api/v1/weather?lat=${lat}&lon=${lon}`
      } else {
        theUrl = `https://cscloud8-46.lnu.se/api/v1/weather?lat=${lat}&lon=${lon}`
      }
      // Fetch the weather and allow cancellation with the abort signal if the component is removed from the DOM.
      try {
        const getWeather = await fetch(theUrl, {
          signal: this.abortController.signal
        })
        if (getWeather.ok) {
          const weatherData = await getWeather.json()

          // Add values to the elemens in the DOM.
          this.weatherTemp.textContent = `${Math.round(weatherData.temperature)}°C`
          this.weatherText.textContent = weatherData.weather
          this.weatherLocation.textContent = weatherData.location
          this.weatherIcon.src = weatherData.iconUrl
          this.weatherIcon.alt = weatherData.weather
        } else {
          throw new Error(`${getWeather.status}`)
        }
      } catch (error) {
        console.log('Could not fetch the weather.', error)
        this.weatherText.textContent = 'Kunde inte hämta vädret'
      }
    }

    /**
     * Called when the component is removed from the DOM,
     * cancels ungoing fetch requests using the AbortControllers abort-method.
     */
    disconnectedCallback () {
      this.abortController.abort()
    }
  }
)
