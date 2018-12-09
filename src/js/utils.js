/**
 * Removing DOM elements // måste fixa param här nedan
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
 * Removing a DOM element // måste fixa param här nedan
 * 
 * @param {NodeList} element
 * @param {NodeList} selector
 */
export function removeElement (element, selector) {
  let firstInput = selector.querySelector(element)
  selector.removeChild(firstInput)
}
