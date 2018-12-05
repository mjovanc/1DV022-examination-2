import * as Time from './Time.js'

const template = document.createElement('template')
template.innerHTML = `
<form id="nickname" class="form-group">
  <label class="form-label" for="input-example-1">Nickname</label>
  <input class="form-input" name="nickname" type="text" placeholder="Nickname">
  <input type="submit">
</form>

<form id="question" class="form-group">
  <label class="form-label" for="input-example-1">Answer</label>
  <input class="form-input" name="answer" type="text" placeholder="Answer">
  <input type="submit">
</form>
`

export class Quiz extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._questionForm = this.shadowRoot.querySelector('#question')
    this._nicknameForm = this.shadowRoot.querySelector('#nickname')
    this._config = {
      questionUrl: 'http://vhost3.lnu.se:20080/question',
      answerUrl: 'http://vhost3.lnu.se:20080/answer'
    }
    this._nickname = ''
  }

  connectedCallback () {
    this._nicknameForm.addEventListener('submit', (event) => {
      event.preventDefault() // removing /q=blabla in the url
      this.nickname = event.target.nickname.value
      event.target.hidden = true
    })
    this._questionForm.addEventListener('submit', (event) => {
      event.preventDefault()
      return this.getQuestion(1)
    })
  }

  disconnectedCallback () {
    // lägg till alla här sen
  }

  async getQuestion (id) {
    let questionResult = await window.fetch(`${this._config.questionUrl}/${id}`)
    return questionResult.json()
    // console.log(qResults.json())
    // this.sendAnswer(1, 2) // 1 is id and 2 the answer of the question id 1
    // we send the answer here
  }

  async sendAnswer (id, answer) {
    let postReq = await window.fetch(`${this._config.answerUrl}/${id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        answer: answer, // sending serializing answer with post request
      })
    }).then( (response) => { 
      console.log('woohoo!')
      // we should add the new question id url to questionUrl here
   })
  }
  
}

window.customElements.define('quiz-form', Quiz)