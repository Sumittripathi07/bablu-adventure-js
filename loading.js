export default class Loading {
  constructor(x = 100, y = 100) {
    this.x = x
    this.y = y
  }

  draw(ctx) {
    ctx.font = '40px Arial'
    ctx.fillStyle = 'black'
    ctx.fillText('Loading Game...', this.x, this.y)
  }
}
