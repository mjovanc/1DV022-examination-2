/**
 * Time module.
 *
 * @module src/js/Time
 * @author Marcus Cvjeticanin
 * @version 1.0
 */

/**
 * A Time object
 *
 * @class Time
 */
export default class Time {
  /**
   * Creates an instance of Quiz.
   * 
   * @param {Object} element
   * @param {Object} player
   * @param {String} url
   * @memberof Time
   */
  constructor (element, player, url) {
    this.element = element
    this.player = player
    this.url = url
    this.stop = false
  }

  /**
   * Displays a timer and calculates the totalTime
   * to the player object.
   */
  timer () {
    let sec = 20
    
    let timer = setInterval(() => {
      if (this.stop) {
        this.player.totalTime += (20 - sec)
        clearInterval(timer)
      } else {
        this.element.innerHTML = sec + ' seconds left'
        sec--
        if (sec < 0) {
          clearInterval(timer)
          window.location.replace(this.url)
        }
      }
    }, 1000)
  }
}