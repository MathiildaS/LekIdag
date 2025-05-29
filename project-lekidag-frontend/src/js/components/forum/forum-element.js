/**
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 * @version 1.0.0
 */
import { sharedStyles } from '../../../css/shared.js'
import { fetchWithTokens } from '../../tokens.js'

const forumTemplate = document.createElement('template')
forumTemplate.innerHTML = `
<style>
  ${sharedStyles}

  .forum-section {
    display: none;
    max-width: 900px;
    margin: 2rem auto;
    padding: 2rem;
  }

  .forum-section h2, .forum-section p {
    text-align: center;
  }

  .forum-section h2 {
    color: #d88c66;
   margin-bottom: 0.5rem;
  }

  .forum-section p {
    margin-bottom: 2rem;
  }

  .forum-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem auto 0 auto;
    background-color: #fffef9;
  }

  .forum-table th, .forum-table td {
    border: 1px solid #d88c66;
    padding: 0.75rem 1rem;
    text-align: center;
  }

  .forum-table th {
    background-color: #FFF5E5;
    text-transform: uppercase;
    color: #d88c66;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    letter-spacing: 0.05em;
  }

  .forum-table tr:hover {
    background-color: #FFF5E5;
    cursor: pointer;
  }

  .forum-detail {
    display: none;
    margin-top: 2rem;
    padding: 1.5rem;
    background-color: #fff5e5;
    border: 2px solid #d88c66;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .post-meta {
    text-align: center;
    font-style: italic;
    color: #d88c66;
    margin-bottom: 1.5rem;
  }
</style>
<section class="forum-section">
  <h2>Ta del av och dela med er i forumet!</h2>
  <p>Har ni hittat en favoritlek, ett pyssel som blev en hit eller ett nytt smultronställe ni vill tipsa om?<br> 
  Dela med er, inspirera andra och byt idéer - kanske blir just ert inlägg någon annans räddning en regnig dag!</p>
<button class="post-button styled-button">Skapa nytt inlägg</button>

<form class="form">
    <section class="forum-rules">
  <h2>Forumregler</h2>
  <ul>
    <li>Håll en vänlig och respektfull ton.</li>
    <li>Det är inte tillåtet att posta stötande, diskriminerande eller olagligt innehåll.</li>
    <li>Inlägg med reklam eller spam tas bort.</li>
    <li>Respektera andras åsikter - personangrepp tolereras inte.</li>
    <li>Posta inte personuppgifter eller bilder på andra utan samtycke.</li>
  </ul>
</section>
  <label>Titel: <input name="title" required /></label>
  <label>Kategori:
    <select name="category">
      <option value="Allmänt">Allmänt</option>
      <option value="Lekar">Lekar</option>
      <option value="Pyssel">Pyssel</option>
      <option value="Utmaningar">Utmaningar</option>
      <option value="Väder">Väder</option>
      <option value="Badplatser">Badplatser</option>
      <option value="Lekplatser">Lekplatser</option>
    </select>
  </label>
  <label>Innehåll: <textarea name="content" required></textarea></label>
  <button type="submit" class="styled-button">Publicera</button>
  <p>Genom att posta godkänner du våra forumregler.</p>
</form>

<table class="forum-table">
  <thead>
    <tr>
      <th>Författare</th>
      <th>Titel</th>
      <th>Kategori</th>
      <th>Datum</th>
    </tr>
  </thead>
  <tbody class="forum-post-list"></tbody>
</table>
  <div class="forum-detail"></div>
</section>

<div class="popup">
  <p class="popup-text"></p>
</div>
`

customElements.define('forum-element',
  /**
   * Displays the forum.
   */
  class extends HTMLElement {
    /**
     * Create a shadow DOM for the forum-element and attach the template to its shadow root.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(forumTemplate.content.cloneNode(true))

      // Creates a new AbortController object instance to make it possible to remove event listeners.
      this.abortController = new AbortController()

      // References to the elements in the shadow DOM.
      this.popup = this.shadowRoot.querySelector('.popup')
      this.popupText = this.shadowRoot.querySelector('.popup-text')
      this.forumSection = this.shadowRoot.querySelector('.forum-section')
      this.postList = this.shadowRoot.querySelector('.forum-post-list')
      this.detailContainer = this.shadowRoot.querySelector('.forum-detail')
      this.createPost = this.shadowRoot.querySelector('.post-button')
      this.postForm = this.shadowRoot.querySelector('.form')
      this.table = this.shadowRoot.querySelector('.forum-table')

      this.loggedInUser = ''
    }

    /**
     * Called when the forum-element is added to the DOM.
     * Listen for event listeners to update user-status and display buttons according to status.
     * Use abortSignal to send signal to remove the event listener when abort-method is called.
     */
    connectedCallback () {
      this.loggedInUser = sessionStorage.getItem('username') || ''

      // Show or hide "Create Post" button depending on login status
      this.updateAuthUI()

      // Display the form to create a new post
      this.createPost.addEventListener('click', () => {
        this.postList.style.display = 'none'
        this.detailContainer.style.display = 'none'
        this.createPost.style.display = 'none'
        this.forumSection.querySelector('h2').style.display = 'none'
        this.forumSection.querySelector('p').style.display = 'none'
        this.table.style.display = 'none'
        this.postForm.style.display = 'flex'
      }, { signal: this.abortController.signal })

      // Submit form to create or edit a post.
      this.postForm.addEventListener('submit', (event) => {
        this.submitPost(event)
      }, { signal: this.abortController.signal })

      // Listen for login custom event. Call updateAuthUI to display correct buttons.
      window.addEventListener('user-login', (loginEvent) => {
        this.loggedInUser = loginEvent.detail.username
        this.updateAuthUI()
      }, { signal: this.abortController.signal })
    }

    /**
     * Check if access token is saved and available in sessionStorage.
     * Display "Skapa nytt inlägg" if so.
     */
    updateAuthUI () {
      const accessToken = sessionStorage.getItem('accessToken')

      if (accessToken) {
        this.createPost.style.display = 'block'
      } else {
        this.createPost.style.display = 'none'
      }
    }

    /**
     * Displays the forum start page with welcome text and list of posts.
     */
    displayPostsView () {
      this.forumStartPage()
      this.displayPosts()
    }

    /**
     * Fetches all forum posts and updates the list of posts.
     */
    async displayPosts () {
      this.postList.innerHTML = ''
      this.postForm.style.display = 'none'
      this.createPost.style.display = 'none'
      this.detailContainer.style.display = 'none'
      this.table.style.display = 'table'
      this.detailContainer.innerHTML = ''

      try {
        let theUrl = ''
        if (import.meta.env.MODE === 'development') {
          theUrl = 'http://localhost:5000/api/v1/forum'
        } else {
          theUrl = 'https://cscloud8-46.lnu.se/api/v1/forum'
        }

        const response = await fetch(theUrl)
        const allForumPosts = await response.json()

        // Display the posts in the forum table.
        this.displayListOfPosts(allForumPosts)
        this.updateAuthUI()
      } catch {
        this.showPopup('Kunde inte hämta foruminlägg.')
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
     * Displays the list of all forum posts in the table.
     * Creates a row for each post and listen for click on each row to display a specifik post.
     *
     * @param {Array} allForumPosts Array of forum post objects.
     */
    displayListOfPosts (allForumPosts) {
      this.postList.innerHTML = ''
      this.postList.style.display = 'table-row-group'

      allForumPosts.forEach(forumPost => {
        const rowOfTable = document.createElement('tr')

        // Create the column under "Författare"
        const author = document.createElement('td')
        author.textContent = forumPost.authorUsername

        // Create the column under "Titel"
        const title = document.createElement('td')
        title.textContent = forumPost.title

        // Create the column under "Kategori"
        const category = document.createElement('td')
        category.textContent = forumPost.category

        // Create the column under "Datum"
        const date = document.createElement('td')
        date.textContent = new Date(forumPost.createdAt).toLocaleString()

        // Add row to table and listen for click on each row to display the specifik post.
        rowOfTable.append(author, title, category, date)
        rowOfTable.addEventListener('click', () => {
          this.displayPost(forumPost.id)
        })

        this.postList.appendChild(rowOfTable)
      })
    }

    /**
     * Displays a single post in detail view with title, author, category, date and content.
     * Also shows edit/delete buttons if current user is the author.
     *
     * @param {string} postId - The ID of the post to display.
     */
    async displayPost (postId) {
      if (!postId) {
        this.showPopup('Inget inlägg hittades.')
        return
      }

      try {
        // Hide list, form and buttons
        this.postList.style.display = 'none'
        this.postForm.style.display = 'none'
        this.createPost.style.display = 'none'
        this.detailContainer.style.display = 'block'
        this.detailContainer.innerHTML = ''
        this.table.style.display = 'none'

        // Hide welcome message
        this.forumSection.querySelector('h2').style.display = 'none'
        this.forumSection.querySelector('p').style.display = 'none'

        let theUrl = ''
        if (import.meta.env.MODE === 'development') {
          theUrl = `http://localhost:5000/api/v1/forum/${postId}`
        } else {
          theUrl = `https://cscloud8-46.lnu.se/api/v1/forum/${postId}`
        }

        // Fetch the specifik post
        const response = await fetch(theUrl)
        const thePost = await response.json()

        // Create and display the post with details.
        const title = document.createElement('h3')
        title.textContent = thePost.title
        title.classList.add('title')

        const meta = document.createElement('div')
        meta.classList.add('post-meta')
        meta.textContent = `Av ${thePost.authorUsername} · ${thePost.category} · ${new Date(thePost.createdAt).toLocaleString()}`

        const content = document.createElement('p')
        content.textContent = thePost.content
        content.classList.add('forumpost')

        this.detailContainer.append(title, meta, content)

        const accessToken = sessionStorage.getItem('accessToken')

        // Check if the user is the author and display edit/delete button if so.
        if (accessToken && thePost.authorUsername === this.loggedInUser) {
          const editBtn = document.createElement('button')
          editBtn.textContent = 'Redigera inlägg'
          editBtn.classList.add('styled-button')
          editBtn.addEventListener('click', () => {
            this.editPost(thePost)
          })

          const deleteBtn = document.createElement('button')
          deleteBtn.textContent = 'Radera inlägg'
          deleteBtn.classList.add('styled-button')
          deleteBtn.addEventListener('click', () => {
            this.deletePost(thePost.id)
          })

          this.detailContainer.append(editBtn, deleteBtn)
        }

        // Add "Tillbaka till forumet" button and listen for click. Display table with all posts.
        const backButton = document.createElement('button')
        backButton.textContent = 'Tillbaka till forumet'
        backButton.classList.add('styled-button')
        backButton.addEventListener('click', () => {
          this.displayPostsView()
        })

        this.detailContainer.append(backButton)
      } catch {
        this.showPopup('Kunde inte visa inlägg. Försök igen.')
      }
    }

    /**
     * Handles form submission to create or edit a forum post.
     *
     * @param {Event} event - The submit event object.
     */
    async submitPost (event) {
      // Prevent page reload.
      event.preventDefault()

      try {
        // Extract the data from the form.
        const formData = new FormData(this.postForm)
        // Collect the title, content and category.
        const post = {
          title: formData.get('title'),
          content: formData.get('content'),
          category: formData.get('category')
        }

        let theUrl = ''
        if (import.meta.env.MODE === 'development') {
          theUrl = 'http://localhost:5000/api/v1/forum'
        } else {
          theUrl = 'https://cscloud8-46.lnu.se/api/v1/forum'
        }

        // Check if editing existing post or creating a new.
        const postId = this.postForm.dataset.editingId
        // If editingId attribute is set, use PUT and add postId in URL. Else POST and not to create new post.
        const method = postId ? 'PUT' : 'POST'
        const endpoint = postId ? `${theUrl}/${postId}` : theUrl

        // Send request with JWT tokens.
        const response = await fetchWithTokens(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post)
        })

        // If OK, display update or post message. Reset the form from inputs.
        if (response.ok) {
          this.showPopup(postId ? 'Inlägg uppdaterat!' : 'Inlägg publicerat!')
          this.postForm.reset()
          // Remove editing attribute.
          delete this.postForm.dataset.editingId
          // Hide form and refresh list of posts.
          this.postForm.style.display = 'none'
          this.displayPostsView()
        } else {
          this.showPopup('Kunde inte skapa inlägg.')
        }
      } catch (error) {
        this.showPopup('Ett fel uppstod. Försök igen.')
      }
    }

    /**
     * Prepares the form to edit an existing post.
     *
     * @param {object} post - The post object to edit.
     */
    async editPost (post) {
      this.detailContainer.style.display = 'none'
      this.postList.style.display = 'none'
      this.createPost.style.display = 'none'

      // Display the form for editing/posting.
      this.postForm.style.display = 'flex'

      // Populate the form with existing data.
      this.postForm.querySelector('input[name="title"]').value = post.title
      this.postForm.querySelector('textarea[name="content"]').value = post.content
      this.postForm.querySelector('select[name="category"]').value = post.category

      // Store the ID of the post as editingId attribute.
      this.postForm.dataset.editingId = post.id
    }

    /**
     * Deletes a forum post after user confirmation.
     *
     * @param {string} postId - The ID of the post to delete.
     */
    async deletePost (postId) {
      const confirmed = confirm('Är du säker på att du vill radera detta inlägg?')

      // Check if user cancels and do nothing.
      if (!confirmed) return

      try {
        let theUrl = ''
        if (import.meta.env.MODE === 'development') {
          theUrl = `http://localhost:5000/api/v1/forum/${postId}`
        } else {
          theUrl = `https://cscloud8-46.lnu.se/api/v1/forum/${postId}`
        }

        // Send DELETE-request with JWT tokens.
        const response = await fetchWithTokens(theUrl, {
          method: 'DELETE'
        })

        // Display message if success or not.
        if (response.status === 204) {
          this.showPopup('Inlägget raderades.')
          this.displayPostsView()
        } else {
          this.showPopup('Kunde inte radera inlägget.')
        }
      } catch (error) {
        this.showPopup('Ett fel uppstod vid borttagning.')
      }
    }

    /**
     * Resets all the values and forum to initial state.
     */
    forumStartPage () {
      // Display the forum-section.
      this.forumSection.style.display = 'block'

      // Display the table and all the posts.
      this.table.style.display = 'table'
      this.postList.style.display = 'table-row-group'

      // Hide the form and detail of post.
      this.detailContainer.style.display = 'none'
      this.detailContainer.innerHTML = ''
      this.postForm.style.display = 'none'

      // Display the start text.
      this.forumSection.querySelector('h2').style.display = 'block'
      this.forumSection.querySelector('p').style.display = 'block'

      // Reset the form from inputs
      this.postForm.reset()

      // Remove editing attribute.
      delete this.postForm.dataset.editingId

      this.updateAuthUI()
    }
  })
