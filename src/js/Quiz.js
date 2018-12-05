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
      questionID: 1,
      questionURL: 'http://vhost3.lnu.se:20080/question',
      answerUrl: 'http://vhost3.lnu.se:20080/answer'
    }
    this._nickname = ''
  }

  connectedCallback () {
    let q = this.getQuestion(this._config.questionID)
    console.log(q)
    
    this._nicknameForm.addEventListener('submit', (event) => {
      event.preventDefault() // removing /q=blabla in the url
      this.nickname = event.target.nickname.value
      event.target.hidden = true
    })
    
    this._questionForm.addEventListener('submit', (event) => {
      event.preventDefault()
      this.sendAnswer(this._config.questionID, event.target.answer.value)
      return
    })
  }

  disconnectedCallback () {
    // lägg till alla här sen
  }

  async getQuestion (id) {
    let questionResult = await window.fetch(`${this._config.questionURL}/${id}`)
    return questionResult.json()
  }

  async sendAnswer (id, answer) {
    let config = this._config

    let postReq = await window.fetch(`${config.answerUrl}/${id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answer: answer })
    }).then((response) => {
      if (response.ok) {
        response.json().then(function(data) {
          let nextURL = data.nextURL
          // we retrieve response object and pass the new questionURL and questionID to config object
          config.questionURL = nextURL
          config.questionID = nextURL.substring(nextURL.lastIndexOf('/') + 1)
        })
      } else {
        console.error('Something went wrong!')
      }
   })
  }

}

window.customElements.define('quiz-form', Quiz)