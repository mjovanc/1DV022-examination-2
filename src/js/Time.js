export default class Time {
  constructor () {
    this.startTime = new Date().getTime()
    this.totalQuestionTime = 20
  }

  countDown () {
    let currentTime = new Date().getTime()
    let diff = currentTime - this.startTime
    let seconds = this.totalQuestionTime - Math.floor(diff / 1000)
    
    return seconds
  }
}