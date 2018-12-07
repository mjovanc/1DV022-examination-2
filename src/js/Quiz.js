import * as Time from './Time.js'

const template = document.createElement('template')
template.innerHTML = `
<form id="question">
  <h3 id="title"></h3>
  <fieldset>
    <input type="text" name="answer">
    <input type="submit" name="submit">
  </fieldset>
</form>
`

export class Quiz extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.questionForm = this.shadowRoot.querySelector('#question')
    this._fieldset = this.shadowRoot.querySelector('fieldset')
    this._questionID = 1
  }

  connectedCallback () {
    this.getQuestion(this._questionID)
    
    this.questionForm.addEventListener('submit', (event) => {
      event.preventDefault()
      console.log(event.target.answer.value)

      window.fetch(`http://vhost3.lnu.se:20080/answer/${this._questionID}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( {answer: event.target.answer.value} ) // behöver vi ändra svaret här beroende på vilken typ av input?
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
      // ska rensa input fälten här, skapas ändå nedan.
      let radioButtons = this._fieldset.querySelectorAll('[type="radio"]')

      if (data.alternatives) {
        // få fram radio knappar i templaten
        let firstInput = this._fieldset.querySelector('input')
        this._fieldset.removeChild(firstInput)
        let submit = this._fieldset.querySelector('input[type="submit"]')

        for (let alt in data.alternatives) {
          // skapa radio-knappar data.alternatives[alt]
          let input = document.createElement('input')
          let text = document.createTextNode(data.alternatives[alt])

          input.setAttribute('type', 'radio')
          input.setAttribute('name', 'answer')
          input.setAttribute('value', alt)
          input.appendChild(text) // fungerar inte. Ska visa en textnod efter inputtaggen...?
          
          this._fieldset.insertBefore(input, submit)
        }
      } else {
        // om det existerar radio knappar här ta bort dem och ersätt med en vanlig input
       
        if (radioButtons.length > 0) {
          radioButtons.forEach((btn => {
            console.log(btn)
            this._fieldset.removeChild(btn)
          }))
          
          let input = document.createElement('input')
          let submit = this._fieldset.querySelector('input[type="submit"]')

          input.setAttribute('type', 'text')
          input.setAttribute('name', 'answer')
          
          this._fieldset.insertBefore(input, submit)
        }
        // console.log(radioButtons.length)
        // console.log(radioButtons[0])


        // visa den vanliga rutan igen
        // let input = this._fieldset.querySelectorAll('input')
        // for (let i = 0; i < input.length - 1; i++) {
        //   input[i].parentNode.removeChild(input[i])
        // }

        // let newInput = document.createElement('input')
        // newInput.setAttribute('type', 'text')
        // newInput.setAttribute('name', 'answer')
        
      } 
    })
  }

}

window.customElements.define('quiz-form', Quiz)