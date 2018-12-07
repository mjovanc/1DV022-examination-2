import * as Time from './Time.js'

const template = document.createElement('template')
template.innerHTML = `
<form id="question" class="form-group">
  <h3></h3>
</form>
`

export class Quiz extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.questionForm = this.shadowRoot.querySelector('#question')
    this._questionID = 1
  }

  connectedCallback () {
    this.getQuestion(this._questionID)
    
    this.questionForm.addEventListener('submit', (event) => {
      event.preventDefault()

      let answer = event.target.answer.value

      window.fetch(`http://vhost3.lnu.se:20080/answer/${this._questionID}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( {answer: answer} )
      })
      .then((res) => res.json())
      .then((data) => {
        this.updateQuestionID(data.nextURL)
        this.getQuestion(this._questionID)
      })
    })
  }

  updateQuestionID (url) {
    this._questionID = url.substring(url.lastIndexOf('/') + 1)
  }

  getQuestion (id) {
    window.fetch(`http://vhost3.lnu.se:20080/question/${id}`)
    .then((res) => res.json())
    .then((data) => {
      this.questionForm.firstElementChild.textContent = data.question

      if (data.alternatives) {
        let inputAnswer = this.questionForm.querySelector('#input-answer')
        let submitAnswer = this.questionForm.querySelector('#submit-answer')
        this.questionForm.removeChild(inputAnswer)
        this.questionForm.removeChild(submitAnswer)
        // console.log(inputAnswer)

        let fieldset = document.createElement('fieldset')
        this.questionForm.appendChild(fieldset)

        for (let alt in data.alternatives) {
          this.createAltButton(data.alternatives[alt], fieldset)
        }
      } else {
        // skapa en vanlig inmatnings ruta (input)
        this.createRegularInput()
      }
      let submit = document.createElement('input')
      
      submit.setAttribute('id', 'submit-answer')
      submit.setAttribute('type', 'submit')
      submit.setAttribute('value', 'Svara')
      
      this.questionForm.appendChild(submit)
    })
  }

  createRegularInput () {
    let input = document.createElement('input')

    input.setAttribute('id', 'input-answer')
    input.setAttribute('type', 'text')
    input.setAttribute('name', 'answer')

    this.questionForm.appendChild(input)
  }

  createAltButton (alternative, fieldset) {
    let input = document.createElement('input')
    let newText = document.createTextNode(alternative)

    input.setAttribute('id', 'input-answer')
    input.setAttribute('type', 'radio')
    input.setAttribute('name', 'choice')
    input.setAttribute('value', alternative)
    
    fieldset.appendChild(input)
    fieldset.appendChild(newText)
  }

}

window.customElements.define('quiz-form', Quiz)