/**
 * Player module.
 *
 * @module src/js/Player
 * @author Marcus Cvjeticanin
 * @version 1.0
 */

 /**
 * Class representing a player.
 */
export default class Player {
  /**
   * Create a player
   * @param {String} nickname - The nickname of player to create
   */
  constructor (nickname) {
    this.nickname = nickname
    this.totalTime = 0
  }

  getTotalTime () {
    let minAndSec = this.totalTime / 60

  }
}