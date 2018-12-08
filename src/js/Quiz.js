import * as Time from './Time.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
  #question {

  }
  label {
    display: block;
    margin: 5px 5px 5px 0;
  }
  legend {
    font-size: 1.5em;
  }
  input[type=text] {
    display: block;
    margin: 10px 10px 10px 0px;
    padding: 10px; 
    border: 1px solid #ededed; 
    -webkit-border-radius: 2px;
    border-radius: 2px;
    font-size: 1.3em;
  }
  input[type="submit" i] {
    margin: 20px 10px 10px 0;
    display: block;
    padding: 10px 25px;
    border: 0 none;
    cursor: pointer;
    -webkit-border-radius: 2px;
    border-radius: 2px;
    border: 1px solid #ededed; 
    font-size: 1.3em;
  }
</style>
<form id="question">
  <legend></legend>
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

      let answer = event.target.answer.value

      window.fetch(`http://vhost3.lnu.se:20080/answer/${this._questionID}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( {answer: answer } ) // behöver vi ändra svaret här beroende på vilken typ av input?
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.nextURL) {
          this.updateQuestionID(data.nextURL)
          this.getQuestion(this._questionID)
        } else {
          console.log('Quiz is over!')
        }
      })
    })
  }

  updateQuestionID (url) {
    this._questionID = url.substring(url.lastIndexOf('/') + 1)
  }

  removeElements (list, selector) {
    list.forEach((label => {
      selector.removeChild(label)
    }))
  }

  removeElement (element, selector) {
    let firstInput = selector.querySelector(element)
    selector.removeChild(firstInput)
  }

  getQuestion (id) {
    window.fetch(`http://vhost3.lnu.se:20080/question/${id}`)
    .then((res) => res.json())
    .then((data) => {
      this.questionForm.firstElementChild.textContent = data.question
      // ska rensa input fälten här, skapas ändå nedan.
      let radioButtons = this._fieldset.querySelectorAll('[type="radio"]')
      let labels = this._fieldset.querySelectorAll('label')

      if (data.alternatives) {
        console.log(data.alternatives)
        // Vid näst sista frågan så kommer två gånger på rad data.alternatives
        // är en bugg att den inte skapar upp då alternativ.
        // Skapa en if sats för att kolla om föregående fråga innehöll alternativ
        // debugger
        try {
          this.removeElement('input', this._fieldset) // tar bort elementet från selector
          this.removeElements(labels, this._fieldset) // tar bort alla labels och inputs
        } catch (e) {
          this.removeElements(labels, this._fieldset)
          // console.log('couldnt remove')
        }
        
        
        let submit = this._fieldset.querySelector('input[type="submit"]')

        // Creating radio input buttons here
        for (let alt in data.alternatives) {
          let input = document.createElement('input')
          let label = document.createElement('label')
          let text = document.createTextNode(data.alternatives[alt])

          input.setAttribute('type', 'radio')
          input.setAttribute('name', 'answer')
          input.setAttribute('value', alt)
          
          this._fieldset.insertBefore(label, submit)
          label.appendChild(input)
          label.appendChild(text)
        }
      } else {
        // om det inte finns alternativ 
        // om det existerar radio knappar här ta bort dem och ersätt med en vanlig input
       
        if (radioButtons.length > 0) {
          this.removeElements(labels, this._fieldset) // tar bort alla labels och inputs
          
          let input = document.createElement('input')
          let submit = this._fieldset.querySelector('input[type="submit"]')

          input.setAttribute('type', 'text')
          input.setAttribute('name', 'answer')
          
          this._fieldset.insertBefore(input, submit)
        }
        
      } 
    })
  }

}

window.customElements.define('quiz-form', Quiz)