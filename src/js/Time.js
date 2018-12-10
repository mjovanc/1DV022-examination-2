export default class Time {
  constructor (element, player) {
    this.element = element
    this.player = player
    this.totalTime = 0
    this.stop = false
  }

  timer () {
    let sec = 20
    
    let timer = setInterval(() => {
      if (this.stop) {
        this.player.totalTime += (20 - sec)
        clearInterval(timer)
      } else {
        this.element.innerHTML = sec + ' seconds left.'
        sec--
        if (sec < 0) {
          clearInterval(timer)
        }
      }
    }, 1000)
  }
}