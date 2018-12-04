import * as Quiz from './Quiz.js'

window.customElements.define('quiz-form', Quiz)

let quiz = document.createElement('quiz-form')
document.querySelector('#quiz-container').appendChild(quiz)
