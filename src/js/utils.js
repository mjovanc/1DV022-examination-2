/**
 * Utils module.
 *
 * @module src/js/utils
 * @author Marcus Cvjeticanin
 * @version 1.0
 */

/**
 * Removing all children in a DOM element
 * 
 * @param {HTMLElement} list
 * @param {NodeList} selector
 */
export function removeElements (list, selector) {
  list.forEach((label => {
    selector.removeChild(label)
  }))
}

/**
 * Removing the first child element in a DOM element
 * 
 * @param {HTMLElement} element
 * @param {NodeList} selector
 */
export function removeElement (element, selector) {
  let firstInput = selector.querySelector(element)
  selector.removeChild(firstInput)
}

/**
 * Displays player total time in minutes and seconds
 * 
 * @param {Object} player 
 * @returns {String}
 */
export function fancyTime (player) {
  let minutes = Math.floor(player.totalTime / 60)
  let seconds = player.totalTime - minutes * 60
    
  return `${minutes} minutes, ${seconds} seconds`
}
