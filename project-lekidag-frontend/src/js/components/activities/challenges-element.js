/**
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 * @version 1.0.0
 */
import { sharedStyles } from '../../../css/shared.js'

const challengesTemplate = document.createElement('template')
challengesTemplate.innerHTML = `
<style>
  ${sharedStyles}
  :host {
    display: none;
    width: 100%;
  }

  .age, .challenge {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .age-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
    flex-direction: row;
  }

  .challenge {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
</style>
<div class="wrapper">
<div class="age">
  <h2>Här kan du och ditt barn anta en utmaning!</h2>
  <p>Välj vilken åldersgrupp utmaningen ska vara anpassad för</p>
  <div class="age-buttons"></div>
</div>
<div class="challenge">
<h2><span class="title"></span></h2>
<div class="instruction"></div>
<div class="solution"></div>
<button class="new-challenge styled-button">Slumpa en ny utmaning!</button>
<button class="start styled-button">Börja om från början!</button>
</div>
</div>
<div class="popup">
<p class="popup-text"></p>
</div>
`
customElements.define('challenges-element',
  /**
   * A web component that fetches and displays a challenge based on age.
   */
  class extends HTMLElement {
    /**
     * Create a shadow DOM for the challenges-element and attach the template to its shadow root.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(challengesTemplate.content.cloneNode(true))

      // Creates a new AbortController object instance to make it possible to remove event listeners.
      this.abortController = new AbortController()

      // References to the elements in the shadow DOM.
      this.ageContainer = this.shadowRoot.querySelector('.age')
      this.ageButtons = this.shadowRoot.querySelector('.age-buttons')
      this.challengeContainer = this.shadowRoot.querySelector('.challenge')
      this.newChallenge = this.shadowRoot.querySelector('.new-challenge')
      this.start = this.shadowRoot.querySelector('.start')
      this.popup = this.shadowRoot.querySelector('.popup')
      this.popupText = this.shadowRoot.querySelector('.popup-text')

      // Initial state of selected age.
      this.chosenAge = ''
    }

    /**
     * Add age buttons dynamically and add EventListeners when the challenge-element is
     * added to the DOM. Use abortSignal to send signal to remove the event listeners when abort-method is called.
     */
    connectedCallback () {
      const ages = ['0-1', '2-3', '4-5', '6-8', '9-12']
      ages.forEach(age => {
        const ageButton = document.createElement('button')
        ageButton.textContent = age
        ageButton.classList.add('styled-button')

        ageButton.addEventListener('click', () => {
          this.chosenAge = age
          this.displayChallenge()
        }, { signal: this.abortController.signal })
        this.ageButtons.appendChild(ageButton)
      })

      // Reset all values and start over by choosing new age.
      this.start.addEventListener('click', () => {
        this.startPage()
      }, { signal: this.abortController.signal })

      // Reshuffle a new challenge with the same parameters.
      this.newChallenge.addEventListener('click', () => {
        this.displayChallenge()
      }, { signal: this.abortController.signal })
    }

    /**
     * Fetch and display a challenge based on choice of age.
     */
    async displayChallenge () {
      this.ageContainer.style.display = 'none'
      this.challengeContainer.style.display = 'flex'

      try {
        let theUrl = ''
        if (import.meta.env.MODE === 'development') {
          theUrl = `http://localhost:5000/api/v1/challenges/random?age=${this.chosenAge}`
        } else {
          theUrl = `https://cscloud8-46.lnu.se/api/v1/challenges/random?age=${this.chosenAge}`
        }
        const getTheChallenge = await fetch(theUrl, {
          signal: this.abortController.signal
        })

        // Check if fetch was successful and collect the title, instructions and solution from the response.
        if (getTheChallenge.ok) {
          const { title, instructions, solution } = await getTheChallenge.json()

          // References to the element in the shadow DOM.
          const titleElement = this.shadowRoot.querySelector('.title')
          const instructionElement = this.shadowRoot.querySelector('.instruction')
          const solutionElement = this.shadowRoot.querySelector('.solution')

          // Add values to the elements in the shadow DOM.
          titleElement.textContent = title
          instructionElement.innerHTML = instructions
          solutionElement.innerHTML = solution
        } else if (getTheChallenge.status === 404) {
          const instructionElement = this.shadowRoot.querySelector('.instruction')
          this.showPopup('Ingen utmaning hittades för det valet!')
          instructionElement.textContent = ''
        }
      } catch (error) {
        this.showPopup('Något gick fel. Försök igen!')
      }
    }

    /**
     * Reset all values.
     */
    startPage () {
      this.chosenAge = ''
      this.ageContainer.style.display = 'flex'
      this.challengeContainer.style.display = 'none'

      const titleElement = this.shadowRoot.querySelector('.title')
      const instructionElement = this.shadowRoot.querySelector('.instruction')
      const solutionElement = this.shadowRoot.querySelector('.solution')
      titleElement.textContent = ''
      instructionElement.textContent = ''
      solutionElement.textContent = ''
    }

    /**
     * Reset all values and displays the buttons to select age.
     */
    displayButtons () {
      this.startPage()
      this.style.display = 'block'
      this.ageContainer.style.display = 'flex'
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
     * cancels ungoing fetch requests using the AbortControllers abort-method and removes EventListeners.
     */
    disconnectedCallback () {
      this.abortController.abort()
    }
  })
