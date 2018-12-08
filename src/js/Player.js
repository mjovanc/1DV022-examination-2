export default class Player {
  constructor (nickname) {
    this.nickname = nickname
    this.score = undefined
  }

  getNickname () {
    return this.nickname
  }
}