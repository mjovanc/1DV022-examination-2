import * as Time from './Time.js'

const template = document.createElement('template')
template.innerHTML = `
<div id="question">
  <h1 id="question-id" class="text-center""></h1>
  <p id="question-text" class="text-center text-large""></p>
</div>

<form>
  <input name="nickname" type="text">
  <input type="submit">
</form>
`

export class Quiz extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._questionDiv = this.shadowRoot.querySelector('#question')
    this._config = {
      startUrl: 'http://vhost3.lnu.se:20080/question'
    }
    this._nickname = ''
  }

  connectedCallback () {
    this.shadowRoot.addEventListener('submit', this._submitNickname)
    this.shadowRoot.addEventListener('submit', (event) => {
      return this.getQuestions(1)
    })
  }

  disconnectedCallback () {
    this.shadowRoot.removeEventListener('submit', this._submitNickname)
  }

  _submitNickname (event) {
    event.preventDefault() // removing /q=blabla in the url
    this.nickname = event.target.nickname.value
    event.target.hidden = true
  }

  async getQuestions (id) {
    let qResults = await window.fetch(`${this._config.startUrl}/${id}`)
    // return qResults.json()
    console.log(qResults.json())
  }

  async sendAnswerToQuestion (id) {

  }
  
}

window.customElements.define('quiz-form', Quiz)