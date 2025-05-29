/**
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 * @version 1.0.0
 */
import { sharedStyles } from '../../../css/shared.js'

const registerTemplate = document.createElement('template')
registerTemplate.innerHTML = `
<style>
  ${sharedStyles}
  .form button {
    align-self: center;
    margin-top: 1rem;
  }

  .form p {
    text-align: center;
    font-size: 0.7em;
  }

  .info {
    display: none;
    text-align: center;
  }

</style>
<div class="info">
  <h2>Registrera dig som användare</h2>
  <p>Skapa ett konto för att dela egna tips och inspirera andra i vårt forum!</p>
</div>
<form class="form">
  <input name="username" placeholder="Användarnamn" required />
  <input name="email" type="email" placeholder="E-post" required />
  <input name="firstName" placeholder="Förnamn" required />
  <input name="lastName" placeholder="Efternamn" required />
  <input name="password" type="password" placeholder="Lösenord" required />
  <button type="submit" class="styled-button">Registrera</button>  
  <p>Vi värnar om din integritet.<br>
  Dina personuppgifter hanteras i enlighet med GDPR och används endast för <br>att du ska kunna logga in, skapa och administrera dina inlägg i forumet.<br>
  Du kan när som helst radera ditt konto via din profil.</p>
</form>
<div class="popup">
  <p class="popup-text"></p>
</div>
`
customElements.define('register-element',
  /**
   * A web component that renders a register form and registers a user.
   */
  class extends HTMLElement {
    /**
     * Create a shadow DOM for the register-element and attach the template to its shadow root.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(registerTemplate.content.cloneNode(true))

      // Creates a new AbortController object instance to make it possible to remove event listeners.
      this.abortController = new AbortController()

      // References to the elements in the shadow DOM.
      this.registerForm = this.shadowRoot.querySelector('.form')
      this.info = this.shadowRoot.querySelector('.info')
      this.popup = this.shadowRoot.querySelector('.popup')
      this.popupText = this.shadowRoot.querySelector('.popup-text')
    }

    /**
     * Adds an event listener to the form to handle user registration when the register-element is
     * added to the DOM. Use abortSignal to send signal to remove the event listener when abort-method is called.
     */
    connectedCallback () {
      // Listen for the forms submit event.
      this.registerForm.addEventListener('submit', async (event) => {
        // Prevent the form from reloading the page on submit.
        event.preventDefault()

        // Create a object with data from the form.
        const dataFormInput = new FormData(this.registerForm)

        // Convert the created object and the entries to a JavaScript object with key/value-pairs.
        const dataObject = Object.fromEntries(dataFormInput.entries())

        try {
          let theUrl = ''
          if (import.meta.env.MODE === 'development') {
            theUrl = 'http://localhost:5000/api/v1/user/register'
          } else {
            theUrl = 'https://cscloud8-46.lnu.se/api/v1/user/register'
          }
          // Send a POST request to backend with the form data as JSON.
          const sendForm = await fetch(theUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObject)
          })

          // Parse the response.
          const response = await sendForm.json()

          // If successful registration display message and reset form.
          if (sendForm.ok) {
            this.showPopup('Lyckad registrering! Du kan nu logga in.')
            this.registerForm.reset()

            setTimeout(() => {
              location.reload()
            }, 2000)
          } else {
            this.showPopup(response.error || 'Något gick fel vid registrering. Försök igen.')
          }
        } catch (error) {
          this.showPopup('Kunde inte ansluta. Försök igen.')
        }
      }, { signal: this.abortController.signal })
    }

    /**
     * Display the register form.
     */
    displayForm () {
      this.info.style.display = 'block'
      this.registerForm.style.display = 'flex'
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
     * Called when removed from DOM. Listen for signal to abort event listeners or
     * fetch requests to prevent memory leaks.
     */
    disconnectedCallback () {
      this.abortController.abort()
    }
  })
