import * as Player from './Player.js'
import * as Time from './Time.js'

const questionTemplate = document.createElement('template')
questionTemplate.innerHTML = `
<h1 id="question-id" class="text-center"">Question #1</h1>
<p id="question-text" class="text-center text-large"">
Question here...
</p>
`

export class Quiz extends window.HTMLElement {
  constructor () {
    super()
    
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(questionTemplate.content.cloneNode(true))
    this._h1 = this.shadowRoot.querySelector('#question-id')
    this._p = this.shadowRoot.querySelector('#question-text')
    this._config = {
      startUrl: 'http://vhost3.lnu.se:20080/question/1'
    }
    this._questions = {} // JSON data
    this._players = {} // player objects 
    this._highScores = {}
  }
  
  // getQuestions () {}

  // highScores () {}
}

window.customElements.define('quiz-form', Quiz)