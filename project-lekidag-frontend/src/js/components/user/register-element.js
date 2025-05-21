/**
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 * @version 1.0.0
 */
import { sharedStyles } from '../../../css/shared.js'

const registerTemplate = document.createElement('template')
registerTemplate.innerHTML = `
<style>
  ${sharedStyles}

.form {
  display: none;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border: 2px solid #E89E69;
  border-radius: 16px;
  background-color: #fffef9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.form input {
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: 1px solid #E89E69;
  border-radius: 12px;
  background-color: #FFF5E5;
  color: #E89E69;
  font-family: "DynaPuff", cursive;
}

.form input::placeholder {
  color: #E89E69;
  opacity: 0.7;
}

.form input:focus {
  outline: none;
  border-color: #f5a623;
  box-shadow: 0 0 5px #f5a623;
}

.form button {
  align-self: center;
  margin-top: 1rem;
}

.message {
  text-align: center;
  font-size: 0.95rem;
  margin-top: 0.5rem;
  min-height: 1.5rem;
}
</style>
<form class="form">
  <input name="username" placeholder="Användarnamn" required />
  <input name="email" type="email" placeholder="E-post" required />
  <input name="firstName" placeholder="Förnamn" required />
  <input name="lastName" placeholder="Efternamn" required />
  <input name="password" type="password" placeholder="Lösenord" required />
  <button type="submit">Registrera</button>
<div class="popup">
  <p class="popup-text"></p>
</div>
</form>
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
      this.infoMessage = this.shadowRoot.querySelector('.message')
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
