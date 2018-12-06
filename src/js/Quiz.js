import * as Time from './Time.js'

const template = document.createElement('template')
template.innerHTML = `
<form id="question" class="form-group">
  <h3 name="title"></h3>
  <label>Answer</label>
  <input name="answer" type="text" placeholder="Answer">
  <input type="submit" value="Svara">
</form>
`

export class Quiz extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.questionForm = this.shadowRoot.querySelector('#question')
    this.questionID = 1
  }

  connectedCallback () {
    this.getQuestion(this.questionID)
    this.questionForm.addEventListener('submit', this.submitAnswer)
  }

  getQuestion (id) {
    window.fetch(`http://vhost3.lnu.se:20080/question/${id}`)
    .then((res) => res.json())
    .then((data) => {
      this.questionForm.firstElementChild.textContent = data.question 
    })
  }

  submitAnswer (event) {
    event.preventDefault()

    let answer = event.target.answer.value
    let id = this.questionID

    window.fetch(`http://vhost3.lnu.se:20080/answer/${id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( {answer: answer} )
    })
    .then((res) => res.json())
    .then((data) => console.log(data))
  }

}

window.customElements.define('quiz-form', Quiz)