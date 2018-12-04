import * as Time from './Time.js'

const inputTemplate = document.createElement('template')
inputTemplate.innerHTML = `
<form>
<input name="nickname" type="text">
<input type="submit">
</form>
`

class Player extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(inputTemplate.content.cloneNode(true))
    this.nickname = ''
    this.totalTime = 0
  }

  connectedCallback () {
    this.shadowRoot.addEventListener('submit', this._submitNickname)
  }

  _submitNickname (event) {
    this.nickname = event.target.nickname.value
    console.log(event.target.nickname.value)
  }

  // updateTotalTime () {}
}

window.customElements.define('player-form', Player)
