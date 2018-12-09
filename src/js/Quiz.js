/**
 * Quiz module.
 *
 * @module src/js/Quiz
 * @author Marcus Cvjeticanin
 * @version 1.0
 */

import Player from './Player.js'
import * as utils from './utils.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
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
  table {
    margin: 0 10px 25px 0;
    width: 100%;
  }
  table th {
    text-align: left;
  }
  #quiz-end a {
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
  <span id="time-left"></span>
</form>

<div id="quiz-end">
  <h2></h2>

  <h3>Top list</h3>
  <table>
    <tr>
      <th scope="col">Player</th>
      <th scope="col">Time</th>
    </tr>
  </table>
  <a href="#">Play the Quiz again?</a>
</div>
`

/**
 * A Quiz element that lets a player answer to a series of questions.
 *
 * @class Quiz
 * @extends {window.HTMLElement}
 */
export class Quiz extends window.HTMLElement {
  /**
   * Creates an instance of Quiz.
   * 
   * @memberof Quiz
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    
    this._nicknameForm = this.shadowRoot.querySelector('#nickname')
    this._nicknameFieldset = this._nicknameForm.querySelector('fieldset')

    this._questionForm = this.shadowRoot.querySelector('#question')
    this._questionFieldset = this._questionForm.querySelector('fieldset')
    this._questionForm.hidden = true
    
    this._quizEnd = this.shadowRoot.querySelector('#quiz-end')
    this._quizEnd.hidden = true
    this._questionID = 1
    
    this.player = undefined
    this.playerTime = undefined
    this.timeLeft = undefined
    
    this.url = location.protocol + '//' + location.host + '/'
  }

  /**
   * Called when connected to the DOM
   * 
   * @memberof Quiz
   */
  connectedCallback () {

    // Creating the player object
    this._nicknameForm.addEventListener('submit', (event) => {
      event.preventDefault()

      try {
        let nickname = event.target.nickname.value
        let player = new Player(nickname)
        this.player = player

        event.target.hidden = true
        this._questionForm.hidden = false

        this.getQuestion(this._questionID)
        // let timer = undefined
        // timer = setTimeout(() => {
          
        // }, 2000)
      } catch (e) {
        console.error('Error!')
      }
    })

    this._questionForm.addEventListener('submit', async event => {
      event.preventDefault()

      let timer = undefined
      timer = setTimeout(() => {
        this._questionForm.hidden = true
        this.presentHighScores()
        this.lostQuiz()
      }, 20000)
      // Add the time to the player object here. It runs inside function getQuestion()

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
      .then((res) => {
        if (res.ok) {
          return res.json()

          .then((data) => {
            if (data.nextURL) {
              this.updateQuestionID(data.nextURL)
              this.getQuestion(this._questionID)
            } else {
              let playerData = {
                'nickname': this.player.nickname,
                'totalTime': this.player.totalTime
              }
      
              let key = 'player' + window.localStorage.length
              window.localStorage.setItem(key, JSON.stringify(playerData))

              this._questionForm.hidden = true
              this.presentHighScores()
            }
          })
        } else {
          this.presentHighScores()
          this.lostQuiz()
        }
      })
      
    })
  }

  /**
   * Displaying a message that the player has lost.
   * Redirecting the player to the start page.
   * 
   * @memberof Quiz
   */
  lostQuiz () {
    let h2 = this._quizEnd.querySelector('h2')
    let text = document.createTextNode('You lost the game! You will be redirected to the start again.')
    h2.appendChild(text)

    this._questionForm.hidden = true
    let url = this.url

    setTimeout(() => {
      window.location.replace(url)
    }, 5000)
  }
  
  /**
   * Presenting the top five players by time.
   * 
   * @memberof Quiz
   */
  presentHighScores () {
    this._quizEnd.hidden = false

    let players = []
    for (let i = 0; i < localStorage.length; i++) {
      let p = JSON.parse(localStorage.getItem(localStorage.key(i)))
      players.push(p)
    }

    let sortPlayers = players.sort(function (a, b) {
      return a.totalTime - b.totalTime
    })
    let newArr = sortPlayers.slice(0, 5)

    // Creating the table elements
    let table = this._quizEnd.querySelector('table')
    newArr.forEach(function (p) {
      let tr = document.createElement('tr')
      let td1 = document.createElement('td')
      let td2 = document.createElement('td')
      let nickname = document.createTextNode(p.nickname)
      let totalTime = document.createTextNode(p.totalTime)

      table.appendChild(tr)
      tr.appendChild(td1)
      tr.appendChild(td2)
      td1.appendChild(nickname)
      td2.appendChild(totalTime)
    })

    let aTag = this._quizEnd.querySelector('a')
    aTag.setAttribute('href', this.url)
  }

  /**
   * Updating the question ID of given URL
   * 
   * @memberof Quiz
   * @param {String} url
   */
  updateQuestionID (url) {
    this._questionID = url.substring(url.lastIndexOf('/') + 1)
  }

  /**
   * Getting a question by the given id and presenting it on the page.
   * 
   * @memberof Quiz
   * @param {Number} id 
   */
  async getQuestion (id) {    
    window.fetch(`http://vhost3.lnu.se:20080/question/${id}`)
    .then((res) => res.json())
    .then((data) => {
      this._questionForm.firstElementChild.textContent = data.question

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
        if (radioButtons.length > 0) {
          utils.removeElements(labels, this._questionFieldset) // tar bort alla labels och inputs
          
          let input = document.createElement('input')
          let submit = this._questionFieldset.querySelector('input[type="submit"]')

          input.setAttribute('type', 'text')
          input.setAttribute('name', 'answer')
          
          this._questionFieldset.insertBefore(input, submit)
        }
      }

      this.countDown()

    })
  }

  countDown () {
    let span = this._questionForm.querySelector('#time-left')

    let totalQuestionTime = 21
    let counter = 1
    let timer = undefined

    timer = setInterval(() => {
      if (counter < totalQuestionTime) {
        counter++
        this.timeLeft = totalQuestionTime - counter
        span.innerHTML = (this.timeLeft) + ' seconds left.'
      } else {
        clearTimeout(timer)
      }
    }, 1000)
  }

}

window.customElements.define('quiz-form', Quiz)