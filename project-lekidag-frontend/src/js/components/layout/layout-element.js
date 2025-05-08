/**
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 * @version 1.0.0
 */
import { sharedStyles } from '../../../css/shared.js'
import { getUserLocation } from '../../geolocation.js'
import logga from '../../../images/lekidag.png'

const layoutTemplate = document.createElement('template')
layoutTemplate.innerHTML = `
<style>
  ${sharedStyles}
  .logga {
    position: absolute;
    top: 0.5rem;
    left: 6rem;
    height: 200px;
    margin-right: 20px;
    vertical-align: middle;
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    row-gap: 0.1rem;
    column-gap: 0.4rem;
    margin-top: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .buttons button {
    padding: 1rem 1rem;
    font-size: 1rem;
    border-radius: 12px;
  }

  .homepage {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.homepage:hover {
  transform: scale(1.05);
}

.startpage {
text-align: center;
}

.startpage h2 {
text-transform: uppercase;
}
</style>

<div class="layout-container">
<header>
  <img src="${logga}" alt="LekIdag" class="logga homepage" />
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
    <div class="startpage">
      <h2>Välkommen till LekIdag!</h2>
      <p>Idétorka? Aldrig mer! 🌟<br><br>
Här på LekIdag hittar du inspiration till roliga aktiviteter - perfekt för föräldrar, barnvakter eller barn med spring i benen.<br><br>

Du kan välja att slumpa fram en lek eller ett pyssel anpassat efter barnets ålder,<br>
kolla väderprognosen för att avgöra om det blir inomhusbus eller utomhuslek<br> 
och anta en spännande utmaning!<br><br>
Med hjälp av kartan hittar du enkelt lekplatser och badplatser nära dig<br>
och om du loggar in kan du dessutom dela med dig av egna tips och bilder i vårt forum.<br><br>

Välj något i menyn ovanför för att komma igång. Vem vet vad du hittar på idag? 🎈<br><br>
Nu kör vi - det är dags att leka!</p>
    </div>
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

      // Creates a new AbortController object instance to make it possible to remove event listeners.
      this.abortController = new AbortController()

      // References to the elements in the shadow DOM.
      this.getGame = this.shadowRoot.querySelector('.game')
      this.getCraft = this.shadowRoot.querySelector('.craft')
      this.displayPlaygrounds = this.shadowRoot.querySelector('.playground')
      this.weather = this.shadowRoot.querySelector('weather-element')
      this.homepage = this.shadowRoot.querySelector('.homepage')
      this.startpage = this.shadowRoot.querySelector('.startpage')
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

      // Listen for click on "Slumpa ett pyssel"-button.
      this.getCraft.addEventListener('click', () => {
        this.display('CRAFTS-ELEMENT')

        // Collect all the slotted elements and find the one with the tag name "crafts-element"
        const assignedNodes = slot.assignedElements()
        const craftElement = assignedNodes.find(element => element.tagName === 'CRAFTS-ELEMENT')

        // Display the buttons to choose age.
        if (craftElement) {
          craftElement.displayButtons()
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

      this.homepage.addEventListener('click', () => {
        const slot = this.shadowRoot.querySelector('slot')
        const slottedElement = slot.assignedElements()

        slottedElement.forEach(element => {
          element.style.display = 'none'
        })

        this.startpage.style.display = 'flex'
      })
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

      this.startpage.style.display = 'none'
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
