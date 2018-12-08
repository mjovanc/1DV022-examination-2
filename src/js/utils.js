export function removeElements (list, selector) {
  list.forEach((label => {
    selector.removeChild(label)
  }))
}

export function removeElement (element, selector) {
  let firstInput = selector.querySelector(element)
  selector.removeChild(firstInput)
}

export function populateStorage (player) {
  window.localStorage.setItem('player', JSON.stringify(player))
}