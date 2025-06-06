/**
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 * @version 1.0.0
 */
import { sharedStyles } from '../../../css/shared.js'
import { fetchWithTokens } from '../../tokens.js'

const profileTemplate = document.createElement('template')
profileTemplate.innerHTML = `
<style>
  ${sharedStyles}
  .form button {
    align-self: center;
    margin-top: 1rem;
  }

  .delete-button {
    display: none;
    justify-content: center;
    margin-top: 2rem;
  }

  .profile-info {
    display: none;
    text-align: center;
    margin-bottom: 2rem;
  }

  #info {
    display: none;
    text-align: center;
    font-size: 0.7em;
  }

  .profileInfo {
    text-transform: uppercase;
    text-decoration: underline;
    color: #d88c66;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    letter-spacing: 0.05em;
  }
</style>
<div class="profile-info">
  <h2 class="welcome-text">Välkommen till din profil!</h2>
  <p class="profileInfo">Namn:</p> <span class="first-name"></span>
  <p class="profileInfo">Efternamn:</p> <span class="last-name"></span>
  <p class="profileInfo">E-post:</p> <span class="email"></span>
</div>
<form class="form" id="passwordForm">
  <h2>Ändra ditt lösenord</h2>
  <input type="password" name="oldPassword" placeholder="Nuvarande lösenord" required />
  <input type="password" name="newPassword" placeholder="Nytt lösenord" required />
  <button type="submit" class="styled-button">Spara nytt lösenord</button>
</form>

<form class="form" id="emailForm">
  <h2>Ändra din e-postadress</h2>
  <input type="email" name="newEmail" placeholder="Ny e-postadress" required />
  <button type="submit" class="styled-button">Spara ny e-post</button>
</form>

<div class="delete-button">
  <button id="deleteAccount" class="styled-button">Radera konto</button>
</div>
<p id="info">När du raderar ditt konto tas dina uppgifter permanent bort från vår databas.<br>
Detta inkluderar användarnamn, e-post och profilinformation.<br>
Publika inlägg kopplade till ditt namn kan finnas kvar.</p>

<div class="popup">
  <p class="popup-text"></p>
</div>
`
customElements.define('profile-element',
  /**
   * A web component that renders a profile page for a logged in user.
   */
  class extends HTMLElement {
    /**
     * Create a shadow DOM for the profile-element and attach the template to its shadow root.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(profileTemplate.content.cloneNode(true))

      // Creates a new AbortController object instance to make it possible to remove event listeners.
      this.abortController = new AbortController()

      // References to the elements in the shadow DOM.
      this.passwordForm = this.shadowRoot.querySelector('#passwordForm')
      this.emailForm = this.shadowRoot.querySelector('#emailForm')
      this.deleteButton = this.shadowRoot.querySelector('#deleteAccount')
      this.delButton = this.shadowRoot.querySelector('.delete-button')
      this.popup = this.shadowRoot.querySelector('.popup')
      this.popupText = this.shadowRoot.querySelector('.popup-text')
      this.profileInfo = this.shadowRoot.querySelector('.profile-info')
      this.welcome = this.shadowRoot.querySelector('.welcome-text')
      this.firstNameField = this.shadowRoot.querySelector('.first-name')
      this.lastNameField = this.shadowRoot.querySelector('.last-name')
      this.emailField = this.shadowRoot.querySelector('.email')
      this.info = this.shadowRoot.querySelector('#info')
    }

    /**
     * Adds an event listener to the forms and delete button to handle update of password, email and removal of account when profile-element is
     * added to the DOM. Use abortSignal to send signal to remove the event listener when abort-method is called.
     */
    connectedCallback () {
      // Listen for the forms submit event.
      this.passwordForm.addEventListener('submit', async (event) => {
        // Prevent the form from reloading the page on submit.
        event.preventDefault()

        // Create a object with data from the form.
        const dataFormInput = new FormData(this.passwordForm)

        // Convert the created object and the entries to a JavaScript object with key/value-pairs.
        const dataObject = Object.fromEntries(dataFormInput.entries())

        try {
          let theUrl = ''
          if (import.meta.env.MODE === 'development') {
            theUrl = 'http://localhost:5000/api/v1/user/password'
          } else {
            theUrl = 'https://cscloud8-46.lnu.se/api/v1/user/password'
          }

          // Send a PUT request to backend with the form data as JSON.
          const sendForm = await fetchWithTokens(theUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObject)
          })
          // Parse the response.
          const response = await sendForm.json()

          // If successful registration display message and reset form.
          if (sendForm.ok) {
            this.showPopup('Lösenord ändrat!')
            this.passwordForm.reset()
          } else {
            this.showPopup(response.error || 'Något gick fel vid ändring av lösenord. Försök igen.')
          }
        } catch (error) {
          this.showPopup('Kunde inte ansluta. Försök igen.')
        }
      }, { signal: this.abortController.signal })

      this.emailForm.addEventListener('submit', async (event) => {
        // Prevent the form from reloading the page on submit.
        event.preventDefault()

        // Create a object with data from the form.
        const dataFormInput = new FormData(this.emailForm)

        // Convert the created object and the entries to a JavaScript object with key/value-pairs.
        const dataObject = Object.fromEntries(dataFormInput.entries())

        try {
          let theUrl = ''
          if (import.meta.env.MODE === 'development') {
            theUrl = 'http://localhost:5000/api/v1/user/email'
          } else {
            theUrl = 'https://cscloud8-46.lnu.se/api/v1/user/email'
          }

          // Send a PUT request to backend with the form data as JSON.
          const sendForm = await fetchWithTokens(theUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObject)
          })
          // Parse the response.
          const response = await sendForm.json()

          // If successful update of email display message and reset form.
          if (sendForm.ok) {
            this.showPopup('Din e-post har blivit ändrad!')
            this.emailForm.reset()
          } else {
            this.showPopup(response.error || 'Något gick fel vid ändring av e-post. Försök igen.')
          }
        } catch (error) {
          this.showPopup('Kunde inte ansluta. Försök igen.')
        }
      }, { signal: this.abortController.signal })

      this.deleteButton.addEventListener('click', async () => {
        const confirmed = confirm('Är du säker på att du vill radera ditt konto? Detta kan inte ångras.')

        if (!confirmed) {
          return
        }

        try {
          let theUrl = ''
          if (import.meta.env.MODE === 'development') {
            theUrl = 'http://localhost:5000/api/v1/user/delete'
          } else {
            theUrl = 'https://cscloud8-46.lnu.se/api/v1/user/delete'
          }
          const deleteAccount = await fetchWithTokens(theUrl, {
            method: 'DELETE'
          })

          if (deleteAccount.status === 204) {
            this.showPopup('Ditt konto har raderats.')
            setTimeout(() => {
              sessionStorage.removeItem('accessToken')
              localStorage.removeItem('refreshToken')
              location.reload()
            }, 2000)
          } else {
            this.showPopup('Något gick fel vid borttagning av konto. Försök igen!')
          }
        } catch (error) {
          this.showPopup(error.message || 'Kunde inte ansluta.')
        }
      })
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
     * Fetches and displays the current user's profile information.
     */
    async displayProfileInfo () {
      try {
        let theUrl = ''
        if (import.meta.env.MODE === 'development') {
          theUrl = 'http://localhost:5000/api/v1/user/profile'
        } else {
          theUrl = 'https://cscloud8-46.lnu.se/api/v1/user/profile'
        }

        const res = await fetchWithTokens(theUrl)

        if (res.ok) {
          const { username, firstName, lastName, email } = await res.json()
          this.welcome.textContent = `Välkommen till din profil, ${username}!`
          this.firstNameField.textContent = firstName
          this.lastNameField.textContent = lastName
          this.emailField.textContent = email
        }
      } catch (error) {
        this.showPopup('Fel vid anslutning till servern.')
      }
    }

    /**
     * Display the forms to update email and pasword.
     */
    displayForm () {
      this.profileInfo.style.display = 'block'
      this.passwordForm.style.display = 'flex'
      this.emailForm.style.display = 'flex'
      this.delButton.style.display = 'flex'
      this.info.style.display = 'block'

      this.displayProfileInfo()
    }

    /**
     * Called when removed from DOM. Listen for signal to abort event listeners or
     * fetch requests to prevent memory leaks.
     */
    disconnectedCallback () {
      this.abortController.abort()
    }
  })
