// import Time from './Time.js'
import Player from './Player.js'
import * as utils from './utils.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
  #question {

  }
  fieldset {
    border: 0;
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

<form id="nickname">
  <legend>Enter your nickname</legend>
  <fieldset>
    <input type="text" name="nickname">
    <input type="submit" name="submit">
  </fieldset>
</form>

<form id="question">
  <legend></legend>
  <fieldset>
    <input type="text" name="answer">
    <input type="submit" name="submit">
  </fieldset>
</form>

<div id="quiz-end">
  <h2></h2>

  <h3>Top list</h3>
  <ul>
    <li>Marcus 1:50:02 seconds</li>
  <ul>
</div>
`

export class Quiz extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    
    this._nicknameForm = this.shadowRoot.querySelector('#nickname')
    this._nicknameFieldset = this._nicknameForm.querySelector('fieldset')

    this.questionForm = this.shadowRoot.querySelector('#question')
    this._questionFieldset = this.questionForm.querySelector('fieldset')
    this.questionForm.hidden = true
    
    this.player = undefined
    this._quizEnd = this.shadowRoot.querySelector('#quiz-end')
    this._quizEnd.hidden = true
    this._questionID = 1
  }

  connectedCallback () {
    this.getQuestion(this._questionID)

    // Creating the player object
    this._nicknameForm.addEventListener('submit', (event) => {
      event.preventDefault()

      try {
        let nickname = event.target.nickname.value
        let player = new Player(nickname)
        this.player = player
        // player.totalTime = 20 // så kan vi lägga till tiden såhär
        utils.populateStorage(player)
       
        event.target.hidden = true
        this.questionForm.hidden = false
      } catch (e) {
        console.error('Error!')
      }
    })
    
    this.questionForm.addEventListener('submit', (event) => {
      event.preventDefault()
      // make check here for inputs in uppercase so that v8 is V8 also
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
          this.questionForm.hidden = true
          this._quizEnd.hidden = false
        }
      })
    })
  }

  lostQuiz () {

  }

  wonQuiz (player, time) {
    return this._highScores.push(player)
  }

  updateQuestionID (url) {
    this._questionID = url.substring(url.lastIndexOf('/') + 1)
  }

  getQuestion (id) {
    window.fetch(`http://vhost3.lnu.se:20080/question/${id}`)
    .then((res) => res.json())
    .then((data) => {
      this.questionForm.firstElementChild.textContent = data.question

      let radioButtons = this._questionFieldset.querySelectorAll('[type="radio"]')
      let labels = this._questionFieldset.querySelectorAll('label')

      if (data.alternatives) {
        try {
          utils.removeElement('input', this._questionFieldset) // tar bort elementet från selector
          utils.removeElements(labels, this._questionFieldset) // tar bort alla labels och inputs
        } catch (e) {
          utils.removeElements(labels, this._questionFieldset)
        }
        
        let submit = this._questionFieldset.querySelector('input[type="submit"]')

        // Creating radio input buttons here
        for (let alt in data.alternatives) {
          let input = document.createElement('input')
          let label = document.createElement('label')
          let text = document.createTextNode(data.alternatives[alt])

          input.setAttribute('type', 'radio')
          input.setAttribute('name', 'answer')
          input.setAttribute('value', alt)
          
          this._questionFieldset.insertBefore(label, submit)
          label.appendChild(input)
          label.appendChild(text)
        }
      } else {
        // om det inte finns alternativ 
        // om det existerar radio knappar här ta bort dem och ersätt med en vanlig input
       
        if (radioButtons.length > 0) {
          utils.removeElements(labels, this._questionFieldset) // tar bort alla labels och inputs
          
          let input = document.createElement('input')
          let submit = this._questionFieldset.querySelector('input[type="submit"]')

          input.setAttribute('type', 'text')
          input.setAttribute('name', 'answer')
          
          this._questionFieldset.insertBefore(input, submit)
        }

        this.player.totalTime = 20
        
        console.log(this.player)
        
      } 
    })
  }

}

window.customElements.define('quiz-form', Quiz)