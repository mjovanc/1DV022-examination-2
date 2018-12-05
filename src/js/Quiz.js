import * as Time from './Time.js'

const template = document.createElement('template')
template.innerHTML = `
<h1 id="question-id" class="text-center""></h1>
<p id="question-text" class="text-center text-large""></p>
<form id="quiz">
  <input name="nickname" type="text">
  <input type="submit">
</form>
`

export class Quiz extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._tagName = this.shadowRoot.querySelectorAll('quiz-form')
    this._form = this._tagName[0]
    
    this._input = null
    // this._config = {
    //   startUrl: 'http://vhost3.lnu.se:20080/question/1'
    // }
    // this._questions = {} // JSON data
    this._nickname = ''
    // this._highScores = {}
  }

  connectedCallback () {
    this.shadowRoot.addEventListener('submit', this._submitNickname)
  }

  _submitNickname (event) {
    event.preventDefault() // removing /q=blabla in the url
    this.nickname = event.target.nickname.value
  }
  
  // getQuestions () {}

  // highScores () {}
}

window.customElements.define('quiz-form', Quiz)