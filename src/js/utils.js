export function removeElements (list, selector) {
  list.forEach((label => {
    selector.removeChild(label)
  }))
}

export function removeElement (element, selector) {
  let firstInput = selector.querySelector(element)
  selector.removeChild(firstInput)
}
