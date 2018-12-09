export default class Time {
  constructor (element) {
    this._totalQuestionTime = 20
    this._counter = 0
    this._timer = undefined
    this._element = element
  }

  countDown () {
    this._timer = setInterval(() => {
      if (this._counter < this._totalQuestionTime) {
        this._counter++
        this._element.innerHTML = (this._totalQuestionTime - this._counter ) + ' seconds left.'
      } else {
        clearTimeout(this._timer)
      }
    }, 1000)
  }

}