import playerRunLeft from './assets/images/player-run-left.png'
import playerRunRight from './assets/images/player-run-right.png'
import playerStandLeft from './assets/images/player-stand-left.png'
import playerStandRight from './assets/images/player-stand-right.png'
import clearSound from './assets/sounds/clear.mp3'
import deadSound from './assets/sounds/dead.mp3'
import jumpSound from './assets/sounds/jump.mp3'

function createImage(img) {
  const image = new Image()
  image.src = img
  return image
}

export default class Player {
  gravity = 1.3
  constructor(ctx, x = 100, y = 100, width = 66, height = 150) {
    this.ctx = ctx
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.velocity = {
      x: 5,
      y: 0.5
    }
    this.jumpSound = new Audio(jumpSound)
    this.deadSound = new Audio(deadSound)
    this.clearSound = new Audio(clearSound)

    this.isGameOver = false
    this.lastX = null
    this.lastY = null
    this.lastPlayerTravelled = null

    this.sprites = {
      stand: {
        singleSnapWidth: 177,
        width: 66,
        right: createImage(playerStandRight),
        left: createImage(playerStandLeft)
      },
      run: {
        singleSnapWidth: 341,
        width: 127,
        right: createImage(playerRunRight),
        left: createImage(playerRunLeft)
      }
    }
    this.frames = 0
    this.currentActivity = this.sprites.stand.right
    this.currentSnapWidth = this.sprites.stand.singleSnapWidth
    this.state = 'stand-right'
    this.sound = true
  }

  changeActivity(activity) {
    switch (activity) {
      case 'stand-left':
        this.currentActivity = this.sprites.stand.left
        this.currentSnapWidth = this.sprites.stand.singleSnapWidth
        this.width = this.sprites.stand.width
        this.state = 'stand-left'
        break
      case 'stand-right':
        this.currentActivity = this.sprites.stand.right
        this.currentSnapWidth = this.sprites.stand.singleSnapWidth
        this.width = this.sprites.stand.width
        this.state = 'stand-right'
        break
      case 'run-left':
        this.currentActivity = this.sprites.run.left
        this.currentSnapWidth = this.sprites.run.singleSnapWidth
        this.width = this.sprites.run.width
        this.state = 'run-left'
        break
      case 'run-right':
        this.currentActivity = this.sprites.run.right
        this.currentSnapWidth = this.sprites.run.singleSnapWidth
        this.width = this.sprites.run.width
        this.state = 'run-right'
        break
    }
  }

  onGameOver(gameOver) {
    this.gameOver = gameOver
  }

  draw() {
    let frames =
      this.state === 'stand-left' || this.state === 'stand-right'
        ? 0
        : this.state === 'run-right'
        ? this.frames
        : 29 - this.frames

    this.ctx.drawImage(
      this.currentActivity,
      this.currentSnapWidth * frames,
      0,
      this.currentSnapWidth,
      400,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }

  update(canvas, playerTravelled) {
    if (this.state === 'run-left' || this.state === 'run-right') {
      if (this.frames >= 29) {
        this.frames = 0
      } else {
        this.frames++
      }
    }

    this.draw()
    this.lastX = this.x
    this.lastY = this.y
    this.lastPlayerTravelled = playerTravelled

    this.y += this.velocity.y
    this.x += this.velocity.x

    if (this.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += this.gravity
    } else {
      if (!this.isGameOver) {
        this.velocity.y = 0
      }
      this.isGameOver = true
      this.gameOver()
    }
  }

  jump() {
    if (this.sound) {
      this.jumpSound.currentTime = 0
      this.jumpSound.play()
    }
    this.velocity.y = -20
  }

  dead() {
    if (this.sound) {
      this.deadSound.currentTime = 0
      this.deadSound.play()
    }
  }
  clear() {
    if (this.sound) {
      this.clearSound.currentTime = 0
      this.clearSound.play()
    }
  }
}
