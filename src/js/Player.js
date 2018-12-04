import * as Time from './Time.js'

const inputTemplate = document.createElement('template')
inputTemplate.innerHTML = `
<form id="nickname-input">
<input type="text">
<input type="submit">
</form>
`

class Player extends HTMLElement {
  constructor (nickname) {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(inputTemplate.content.cloneNode(true))
    this.nickname = nickname
    this.totalTime = 0
  }

  connectedCallback () {
    this.shadowRoot.addEventListener('submit', this._submitNickname)
  }

  _submitNickname (event) {
    console.log(event.type)
    debugger
  }

  // updateTotalTime () {}
}

window.customElements.define('player-form', Player)