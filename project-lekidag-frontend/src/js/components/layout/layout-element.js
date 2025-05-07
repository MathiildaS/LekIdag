/**
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 * @version 1.0.0
 */
import { sharedStyles } from '../../../css/shared.js'
import { getUserLocation } from '../../geolocation.js'

const layoutTemplate = document.createElement('template')
layoutTemplate.innerHTML = `
<style>
${sharedStyles}
</style>

<div class="layout-container">
<header>
  <h3>LekIdag!</h3>
  <div class="buttons">
    <button class="game">Slumpa en lek</button>
    <button class="craft">Slumpa ett pyssel</button>
    <button class="challenge">Dagens utmaning</button>
  </div>
  <div class="buttons">
    <button class="playground">Hitta din närmsta lekplats</button>
    <button class="bath">Hitta din närmsta badplats</button>
    <button class="forum">Forum</button>
  </button>
  <weather-element></weather-element>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
  &copy; 2025. All rights reserved.
  </footer>
</div>
`

customElements.define('layout-element',
  /**
   * Represents the base-layout of "LekIdag" with menu and weather-display.
   */
  class extends HTMLElement {
    /**
     * Create a shadow DOM for the layout-element and attach the template to its shadow root.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(layoutTemplate.content.cloneNode(true))

      this.abortController = new AbortController()

      this.getGame = this.shadowRoot.querySelector('.game')
      this.displayPlaygrounds = this.shadowRoot.querySelector('.playground')
      this.weather = this.shadowRoot.querySelector('weather-element')
    }

    /**
     * Listen for click on the buttons in the menu to display the slotted elements and
     * trigger seperate functionality. Use signal to remove event listeners from the DOM.
     */
    async connectedCallback () {
      const slot = this.shadowRoot.querySelector('slot')

      this.userPosition = await getUserLocation()

      // Listen for click on "Slumpa en lek"-button.
      this.getGame.addEventListener('click', () => {
        this.display('GAMES-ELEMENT')

        // Collect all the slotted elements and find the one with the tag name "games-element"
        const assignedNodes = slot.assignedElements()
        const gameElement = assignedNodes.find(element => element.tagName === 'GAMES-ELEMENT')

        // Display the buttons to choose age.
        if (gameElement) {
          gameElement.displayButtons()
        }
      }, { signal: this.abortController.signal })

      // Listen for click on "Hitta din närmsta lekplats"
      this.displayPlaygrounds.addEventListener('click', () => {
        this.display('PLAYGROUNDS-ELEMENT')

        const assignedNodes = slot.assignedElements()
        const playgroundElement = assignedNodes.find(element => element.tagName === 'PLAYGROUNDS-ELEMENT')

        // Display the map with user coordinates.
        if (playgroundElement) {
          playgroundElement.displayMap(this.userPosition)
        }
      }, { signal: this.abortController.signal })

      if (this.weather) {
        this.weather.getTheLocation(this.userPosition)
      }
    }

    /**
     * Display the elements with a specific name.
     * Compare the tagName with the name of the element to determine what element to display.
     *
     * @param {string} nameOfElement The name of the element.
     */
    display (nameOfElement) {
      const slot = this.shadowRoot.querySelector('slot')
      const slottedElement = slot.assignedElements()

      slottedElement.forEach(element => {
        element.style.display = (element.tagName === nameOfElement) ? 'block' : 'none'
      })
    }

    /**
     * Called when removed from DOM. Listen for signal to abort event listeners or
     * fetch requests to prevent memory leaks.
     */
    disconnectedCallback () {
      this.abortController.abort()
    }
  }
)
