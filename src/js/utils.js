export function removeElements (list, selector) {
  list.forEach((label => {
    selector.removeChild(label)
  }))
}

export function removeElement (element, selector) {
  let firstInput = selector.querySelector(element)
  selector.removeChild(firstInput)
}

export function populatePlayerToStorage (players) {
  window.localStorage.setItem('players', JSON.stringify(players))
}

// export function getPlayerFromStorage (player) {
//   let p = window.localStorage.getItem('player')
//   return JSON.parse(p)
// }