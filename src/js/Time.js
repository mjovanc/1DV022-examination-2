export default class Time {
  constructor (element) {
    this._totalQuestionTime = 21
    this._counter = 1
    this.timeleft = undefined
    this._timer = undefined
    this._element = element
  }

  countDown () {
    this._timer = setInterval(() => {
      if (this._counter < this._totalQuestionTime) {
        this._counter++
        this.timeleft = this._totalQuestionTime - this._counter
        this._element.innerHTML = (this.timeleft) + ' seconds left.'
        
        return this.timeleft
      } else {
        clearTimeout(this._timer)
      }
    }, 1000)
  }

}