/**
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 * @version 1.0.0
 */
import { sharedStyles } from '../../../css/shared.js'

const gamesTemplate = document.createElement('template')
gamesTemplate.innerHTML = `
<style>
  ${sharedStyles}

:host {
    display: none;
    width: 100%;
  }

  .age, .location, .game {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .age p,
.location p {
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 1.3rem;
}

  .age-buttons,
  .location-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
    flex-direction: row;
  }

  .game {
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: #E89E69;
  }
</style>
<div class="age">
  <p>Välj vilken åldersgrupp leken ska vara anpassad för</p>
  <div class="age-buttons"></div>
</div>
<div class="location">
  <p>Välj var du önskar genomföra leken</p>
  <div class="location-buttons"></div>
</div>
<div class="game">
<h2><span class="title"></span></h2>
<div class="instruction"></div>
<button class="new-game">Slumpa en ny lek!</button>
<button class="start">Börja om från början!</button>
</div>
`

customElements.define('games-element',
  /**
   * A web component that fetches and displays a game based on age and location.
   */
  class extends HTMLElement {
    /**
     * Create a shadow DOM for the games-element and attach the template to its shadow root.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(gamesTemplate.content.cloneNode(true))

      // Creates a new AbortController object instance to make it possible to remove event listeners.
      this.abortController = new AbortController()

      // References to the elements in the shadow DOM.
      this.ageContainer = this.shadowRoot.querySelector('.age')
      this.locationContainer = this.shadowRoot.querySelector('.location')
      this.ageButtons = this.shadowRoot.querySelector('.age-buttons')
      this.locationButtons = this.shadowRoot.querySelector('.location-buttons')
      this.gameContainer = this.shadowRoot.querySelector('.game')
      this.newGame = this.shadowRoot.querySelector('.new-game')
      this.start = this.shadowRoot.querySelector('.start')

      // Initial state of selected age and location.
      this.chosenAge = ''
      this.chosenLocation = ''
    }

    /**
     * Add age and location buttons dynamically and add EventListeners when the game-element is
     * added to the DOM. Use abortSignal to send signal to remove the event listeners when abort-method is called.
     */
    connectedCallback () {
      const ages = ['0-1', '2-3', '4-5', '6-8', '9-12']
      ages.forEach(age => {
        const ageButton = document.createElement('button')
        ageButton.textContent = age

        // Display the location buttons when age is selected.
        ageButton.addEventListener('click', () => {
          this.chosenAge = age

          this.ageContainer.style.display = 'none'
          this.locationContainer.style.display = 'flex'
        }, { signal: this.abortController.signal })

        this.ageButtons.appendChild(ageButton)
      })

      // Call the displayGame-method that fetches a game when location is selected.
      const locations = ['Inomhus', 'Utomhus']
      locations.forEach(location => {
        const locationButton = document.createElement('button')
        locationButton.textContent = location

        locationButton.addEventListener('click', () => {
          this.chosenLocation = location
          this.displayGame()
        }, { signal: this.abortController.signal })

        this.locationButtons.appendChild(locationButton)
      })

      // Reshuffle a new game with the same parameters.
      this.newGame.addEventListener('click', () => {
        this.displayGame()
      }, { signal: this.abortController.signal })

      // Reset all values and start over by choosing new age and location.
      this.start.addEventListener('click', () => {
        this.startPage()
      }, { signal: this.abortController.signal })
    }

    /**
     * Fetch and display a game based on choice of age and location.
     */
    async displayGame () {
      this.locationContainer.style.display = 'none'
      this.gameContainer.style.display = 'flex'

      try {
        let theUrl = ''
        if (import.meta.env.MODE === 'development') {
          theUrl = `http://localhost:5000/api/v1/games/random?age=${this.chosenAge}&location=${this.chosenLocation}`
        } else {
          theUrl = `https://cscloud8-46.lnu.se/api/v1/games/random?age=${this.chosenAge}&location=${this.chosenLocation}`
        }
        const getTheGame = await fetch(theUrl, {
          signal: this.abortController.signal
        })

        // Check if fetch was successful and collect the title and instructions from the response.
        if (getTheGame.ok) {
          const { title, instructions } = await getTheGame.json()

          // References to the element in the shadow DOM.
          const titleElement = this.shadowRoot.querySelector('.title')
          const instructionElement = this.shadowRoot.querySelector('.instruction')

          // Add values to the elements in the shadow DOM.
          titleElement.textContent = title
          instructionElement.textContent = instructions
        } else if (getTheGame.status === 404) {
          const titleElement = this.shadowRoot.querySelector('.title')
          const instructionElement = this.shadowRoot.querySelector('.instruction')
          titleElement.textContent = 'Ingen lek hittades.'
          instructionElement.textContent = ''
        }
      } catch (error) {
        console.error('Kunde inte hämta leken:', error)
      }
    }

    /**
     * Reset all values.
     */
    startPage () {
      this.chosenAge = ''
      this.chosenLocation = ''
      this.ageContainer.style.display = 'flex'
      this.locationContainer.style.display = 'none'
      this.gameContainer.style.display = 'none'

      const titleElement = this.shadowRoot.querySelector('.title')
      const instructionElement = this.shadowRoot.querySelector('.instruction')
      titleElement.textContent = ''
      instructionElement.textContent = ''
    }

    /**
     * Reset all values and displat the buttons to select age.
     */
    displayButtons () {
      this.startPage()
      this.style.display = 'block'
      this.ageContainer.style.display = 'flex'
    }

    /**
     * Called when the component is removed from the DOM,
     * cancels ungoing fetch requests using the AbortControllers abort-method and removes EventListeners.
     */
    disconnectedCallback () {
      this.abortController.abort()
    }
  }
)
