/**
 * Removing DOM elements
 * 
 * @param {NodeList} list
 * @param {NodeList} selector
 */
export function removeElements (list, selector) {
  list.forEach((label => {
    selector.removeChild(label)
  }))
}

/**
 * Removing a DOM element
 * 
 * @param {NodeList} element
 * @param {NodeList} selector
 */
export function removeElement (element, selector) {
  let firstInput = selector.querySelector(element)
  selector.removeChild(firstInput)
}
