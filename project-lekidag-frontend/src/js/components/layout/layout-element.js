/**
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 * @version 1.0.0
 */
import { sharedStyles } from '../../../css/shared.js'
import { getUserLocation } from '../../geolocation.js'
import logga from '../../../images/lekidag.png'
import playing from '../../../images/playing.png'
import { fetchWithTokens } from '../../tokens.js'

const layoutTemplate = document.createElement('template')
layoutTemplate.innerHTML = `
<style>
  ${sharedStyles}
  .logga {
    height: 220px;
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
    <div class="header-content">
      <img src="${logga}" alt="LekIdag" class="logga homepage" />
      <div class="menu">
        <div class="buttons">
          <button class="game">Slumpa en lek</button>
          <button class="craft">Slumpa ett pyssel</button>
          <button class="challenge">Anta en utmaning</button>
        </div>
        <div class="buttons">
          <button class="playground">Hitta din närmsta lekplats</button>
          <button class="swimmingarea">Hitta din närmsta badplats</button>
          <button class="forum">Forum</button>
        </div>
      </div>
      <div class="right-side">
        <weather-element></weather-element>  
        <div class="user-buttons">
          <button class="register">Registrera dig</button>
          <button class="login">Logga in</button>
        </div>
      </div>
    </div>
  </header>
  <main>
    <div class="startpage">
      <h2>Välkommen till LekIdag! </h2>
      <p>Idétorka? Aldrig mer! 🌟<br><br>
      Här på LekIdag hittar du inspiration till roliga aktiviteter - perfekt för föräldrar, barnvakter eller barn med spring i benen.<br><br>

      Du kan välja att slumpa fram en lek eller ett pyssel anpassat efter barnets ålder,<br>
      kolla väderprognosen för att avgöra om det blir inomhusbus eller utomhuslek<br> 
      och anta en spännande utmaning!<br><br>
      Med hjälp av kartan hittar du enkelt lekplatser och badplatser nära dig<br>
      och om du loggar in kan du dessutom dela med dig av egna tips och bilder i vårt forum.<br><br>

      Välj något i menyn ovanför för att komma igång. Vem vet vad du hittar på idag? 🎈<br><br>
      Nu kör vi - det är dags att leka!</p>

      <img src="${playing}" alt="Barn som spelar fotboll" class="illustration">
    </div>
    <slot></slot>
  </main>
  <footer>
    &copy; 2025. All rights reserved.
  </footer>
  <div class="popup">
    <p class="popup-text"></p>
  </div>
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
      this.getChallenge = this.shadowRoot.querySelector('.challenge')
      this.displayPlaygrounds = this.shadowRoot.querySelector('.playground')
      this.displaySwimmingAreas = this.shadowRoot.querySelector('.swimmingarea')
      this.weather = this.shadowRoot.querySelector('weather-element')
      this.homepage = this.shadowRoot.querySelector('.homepage')
      this.startpage = this.shadowRoot.querySelector('.startpage')
      this.registerButton = this.shadowRoot.querySelector('.register')
      this.loginButton = this.shadowRoot.querySelector('.login')
      this.popup = this.shadowRoot.querySelector('.popup')
      this.popupText = this.shadowRoot.querySelector('.popup-text')
    }

    /**
     * Listen for click on the buttons in the menu to display the slotted elements and
     * trigger seperate functionality. Use signal to remove event listeners from the DOM.
     */
    async connectedCallback () {
      const slot = this.shadowRoot.querySelector('slot')

      this.userPosition = await getUserLocation()

      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        this.updateButtons()
      }

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

      // Listen for click on "Anta en utmaning"-button.
      this.getChallenge.addEventListener('click', () => {
        this.display('CHALLENGES-ELEMENT')

        // Collect all the slotted elements and find the one with the tag name "challenge-element"
        const assignedNodes = slot.assignedElements()
        const challengeElement = assignedNodes.find(element => element.tagName === 'CHALLENGES-ELEMENT')

        // Display the buttons to choose age.
        if (challengeElement) {
          challengeElement.displayButtons()
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

      // Listen for click on "Hitta din närmsta badplats"
      this.displaySwimmingAreas.addEventListener('click', () => {
        this.display('SWIMMINGAREA-ELEMENT')

        const assignedNodes = slot.assignedElements()
        const swimmingareaElement = assignedNodes.find(element => element.tagName === 'SWIMMINGAREA-ELEMENT')

        // Display the map with user coordinates.
        if (swimmingareaElement) {
          swimmingareaElement.displayMap(this.userPosition)
        }
      }, { signal: this.abortController.signal })

      if (this.weather) {
        this.weather.getTheLocation(this.userPosition)
      }

      this.homepage.addEventListener('click', () => {
        this.displayStartPage()
      })

      // Listen for click on "Registrera dig"-button.
      this.registerButton.addEventListener('click', () => {
        if (this.registerButton.textContent === 'Registrera dig') {
          this.display('REGISTER-ELEMENT')

          // Collect all the slotted elements and find the one with the tag name "register-element"
          const assignedNodes = slot.assignedElements()
          const registerElement = assignedNodes.find(element => element.tagName === 'REGISTER-ELEMENT')

          // Display the refgister form.
          if (registerElement) {
            registerElement.displayForm()
          }
        } else {
          this.display('PROFILE-ELEMENT')
          // Collect all the slotted elements and find the one with the tag name "profile-element"
          const assignedNodes = slot.assignedElements()
          const profileElement = assignedNodes.find(element => element.tagName === 'PROFILE-ELEMENT')

          // Display the login form.
          if (profileElement) {
            profileElement.displayForm()
          }
        }
      }, { signal: this.abortController.signal })

      // Listen for click on "Logga in"-button.
      this.loginButton.addEventListener('click', async () => {
        if (this.loginButton.textContent === 'Logga in') {
          this.display('LOGIN-ELEMENT')

          // Collect all the slotted elements and find the one with the tag name "login-element"
          const assignedNodes = slot.assignedElements()
          const loginElement = assignedNodes.find(element => element.tagName === 'LOGIN-ELEMENT')

          // Display the login form.
          if (loginElement) {
            loginElement.displayForm()
          }
        } else {
          try {
            let theUrl = ''
            if (import.meta.env.MODE === 'development') {
              theUrl = 'http://localhost:5000/api/v1/user/logout'
            } else {
              theUrl = 'https://cscloud8-46.lnu.se/api/v1/user/logout'
            }

            // Send a POST request to backend with access token provided to logout.
            const logOut = await fetchWithTokens(theUrl, {
              method: 'POST'
            })

            // Parse the response.
            const response = await logOut.json()

            // If successful log out, display message and reset form.
            if (logOut.ok) {
              this.showPopup('Du är nu utloggad!')

              // Delete saved tokens.
              localStorage.removeItem('accessToken')
              localStorage.removeItem('refreshToken')

              // Reset buttons.
              this.registerButton.textContent = 'Registrera dig'
              this.loginButton.textContent = 'Logga in'

              // Display startpage.
              this.displayStartPage()
            } else {
              this.showPopup(response.error || 'Något gick fel vid utloggning.')
            }
          } catch (error) {
            this.showPopup(error.message || 'Ett fel uppstod. Försök igen.')
          }
        }
      }, { signal: this.abortController.signal })

      this.addEventListener('user-login', (loginEvent) => {
        const { username, accessToken, refreshToken } = loginEvent.detail

        this.showPopup(`Välkommen ${username}!`)

        // Save the tokens in localStorage
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        this.updateButtons()
        this.displayStartPage()
      }, { signal: this.abortController.signal })
    }

    /**
     * Rename the buttons "Registrera dig" and "Logga in".
     */
    updateButtons () {
      this.registerButton.textContent = 'Min profil'
      this.loginButton.textContent = 'Logga ut'
    }

    /**
     * Displays the start page and hides all other slotted elements.
     */
    displayStartPage () {
      const slot = this.shadowRoot.querySelector('slot')
      const slottedElement = slot.assignedElements()

      slottedElement.forEach(element => {
        element.style.display = 'none'
      })

      this.startpage.style.display = 'block'
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
