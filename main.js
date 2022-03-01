import soundOff from './assets/images/sound-off.png'
import soundOn from './assets/images/sound-on.png'
import GameOver from './gameover.js'
import Loading from './loading.js'
import MapLoader from './maps/index.js'
import './style.css'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const scoreEl = document.querySelector('#score')
const mapIdEl = document.querySelector('#mapid')
const lifeEl = document.querySelector('#life')
//const timeoutEl = document.querySelector('#timeout')
const sound = document.querySelector('#sound_icon')

const gameOverObj = new GameOver(570, 250)
const loading = new Loading(500, 400)

const min_speed = 5
const max_speed = 15
const accelaration = 0.2
const totalMaps = 2

// paint id of each block on canvas for map debugging
window.paintBlockId = false

canvas.width = 1400
canvas.height = 770
loading.draw(ctx)

const actions = {
  right: {
    tapped: false
  },
  left: {
    tapped: false
  }
}

// variable declarations
let currentMap = 1
let runAnimation = true
let life = 3
let player
let winner
let lastScore = 0
let backgrounds = []
let stages = []
let wallpapers = []
let collectibles = []
let allObjects = []
let playerTravelled = 0
let speed = min_speed
let isGameOver = false
let isGameWon = false

function getCursorPosition(event) {
  if (window.paintBlockId) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log('x: ' + x + ' y: ' + y)
  }
}

function gameOver(wait = 3000) {
  if (isGameOver) return
  isGameOver = true
  player.dead()
  player.velocity.x = 0
  player.velocity.y = -30
  setTimeout(() => {
    life -= 1
    lifeEl.textContent = life
  }, wait)
  if (life <= 1) {
    setTimeout(() => {
      gameOverObj.playGameOverSound()
      runAnimation = false
    }, wait + 200)
    return
  }
  setTimeout(setMap, wait)
}

function gameWon(wait = 6000) {
  if (isGameWon) return
  isGameWon = true
  player.clear()
  player.velocity.x = 0
  player.velocity.y = 0
  if (currentMap < totalMaps) {
    currentMap++
  } else {
    currentMap = 1
  }
  setTimeout(setMap, wait)
}

// reset and load map
function setMap() {
  const mapLoader = new MapLoader(ctx, canvas)
  lastScore += Math.floor(playerTravelled)
  mapIdEl.textContent = currentMap
  const map = mapLoader.load(currentMap)
  backgrounds = map.backgrounds
  wallpapers = map.wallpapers
  stages = map.stages
  collectibles = map.collectibles
  allObjects = [...backgrounds, ...wallpapers, ...stages, ...collectibles]
  player = mapLoader.getPlayer(gameOver)
  winner = map.winner

  // reset all variables
  //timeout = map.timeout
  speed = min_speed
  playerTravelled = 0
  scoreEl.textContent = lastScore
  lifeEl.textContent = life
  actions.left.tapped = false
  actions.right.tapped = false
  isGameOver = false
  isGameWon = false
  applySound(false)
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function setPlayerSpeed() {
  if (actions.right.tapped || actions.left.tapped) {
    speed += accelaration
    speed = speed > max_speed ? max_speed : speed
    scoreEl.textContent = Math.floor(playerTravelled) + lastScore
  }
}

function animation() {
  // loop animation
  requestAnimationFrame(animation)
  if (!runAnimation) return
  if (isGameWon) return

  // clear canvas
  clearCanvas()

  // paint all objects
  drawAllObjects(allObjects)

  // paint player
  player.update(canvas)

  if (life <= 0) {
    gameOverObj.draw(ctx, canvas)
  }
  if (isGameOver) {
    return
  }

  // check if player won this stage
  if (player.x >= winner.obj.x + winner.config.winner.x) {
    gameWon()
  }

  //adjust player speed
  setPlayerSpeed()

  // update player position
  if (actions.left.tapped && player.x > 400) {
    player.velocity.x = -speed
  } else if (actions.right.tapped && player.x < 500) {
    player.velocity.x = speed
  } else {
    player.velocity.x = 0
    if (actions.right.tapped) {
      playerTravelled += speed
      // move all objects to the left
      allObjects.forEach((obj) => {
        obj.x -= speed * obj.speedAdjust
      })
    } else if (actions.left.tapped && playerTravelled > speed) {
      playerTravelled -= speed
      // move all objects to the right
      allObjects.forEach((obj) => {
        obj.x += speed * obj.speedAdjust
      })
    }
  }

  // check if player is out of bounds
  stages.forEach((stage) => {
    if (
      player.y + player.height <= stage.y &&
      player.y + player.height + player.velocity.y >= stage.y &&
      player.x + player.width >= stage.x &&
      player.x <= stage.x + stage.width
    ) {
      player.velocity.y = 0
    } /* else if (
      stage.type === 'hanger' &&
      player.x + player.width >= stage.x &&
      player.x + player.width < stage.x + stage.width &&
      ((player.y < stage.y && player.y + player.height > stage.y + 1) ||
        (player.y >= stage.y && player.y + player.height > stage.y + 1))
    ) {
      player.x -= speed
    }*/
  })

  collectibles.forEach((collectible) => {
    if (
      player.x < collectible.x + collectible.width &&
      player.x + player.width > collectible.x &&
      player.y < collectible.y + collectible.height &&
      player.y + player.height > collectible.y
    ) {
      if (!collectible.isCollected) {
        collectible.isCollected = true
        playerTravelled += collectible.value
        scoreEl.textContent = Math.floor(playerTravelled) + lastScore
      }
    }
  })
}

function applySound(flip = true) {
  if (!flip) {
    if (localStorage.getItem('game_sound') === 'on') {
      setSound('on')
    } else {
      setSound('off')
    }
  } else {
    if (localStorage.getItem('game_sound') === 'on') {
      setSound('off')
    } else {
      setSound('on')
    }
  }
}

function setSound(newStatus) {
  if (newStatus === 'on') {
    sound.src = soundOn
    localStorage.setItem('game_sound', 'on')
    player.sound = true
    gameOverObj.sound = true
  } else {
    sound.src = soundOff
    localStorage.setItem('game_sound', 'off')
    player.sound = false
    gameOverObj.sound = false
  }
}

function drawAllObjects(collections) {
  collections.forEach((obj) => {
    obj.draw(ctx)
  })
}

canvas.addEventListener('mousedown', getCursorPosition)

sound.addEventListener('click', applySound)

window.addEventListener('load', () => {
  setMap()
  animation()
})

window.addEventListener('keydown', ({ key, keyCode }) => {
  // console.log(key, keyCode)
  switch (keyCode) {
    case /*' '*/ 38:
      // to check if player is on the ground then jump
      if (player.velocity.y === 0) {
        player.jump()
      }
      break
    case /*'ArrowLeft'*/ 37:
      actions.right.tapped = false
      actions.left.tapped = true
      player.changeActivity('run-left')
      break
    case /*'ArrowRight'*/ 39:
      actions.left.tapped = false
      actions.right.tapped = true
      player.changeActivity('run-right')
      break
  }
})

window.addEventListener('keyup', ({ key, keyCode }) => {
  switch (keyCode) {
    case /*' '*/ 32:
      break
    case /*'ArrowLeft'*/ 37:
      actions.left.tapped = false
      speed = min_speed
      player.changeActivity('stand-left')
      break
    case /*'ArrowRight'*/ 39:
      actions.right.tapped = false
      speed = min_speed
      player.changeActivity('stand-right')
      break
  }
})
