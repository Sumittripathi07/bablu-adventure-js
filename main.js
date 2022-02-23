import GameOver from './gameover.js'
import Loading from './loading.js'
import MapLoader from './maps/index.js'
import './style.css'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const score = document.querySelector('#score')
const mapid = document.querySelector('#mapid')
const lifeEl = document.querySelector('#life')
const timeoutEl = document.querySelector('#timeout')
const gameOverObj = new GameOver(570, 250)
const loading = new Loading(500, 400)

const min_speed = 5
const max_speed = 15
const accelaration = 0.25

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
let runAnimation = true
let currentMap = 1
let totalMaps = 2
let life = 3
let timeout
let elapsedTime = 0
let timeoutKey

let player
let winner
let lastScore = 0
let backgrounds = []
let stages = []
let wallpapers = []
let playerTravelled = 0
let speed = min_speed
let isGameOver = false
let isGameWon = false

function gameOver(wait = 3000) {
  if (isGameOver) return
  isGameOver = true
  clearTimeout(timeoutKey)
  player.dead()
  player.velocity.x = 0
  player.velocity.y = -30
  setTimeout(() => {
    --life
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
  clearTimeout(timeoutKey)
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
  mapid.textContent = currentMap
  const map = mapLoader.load(currentMap)
  backgrounds = map.backgrounds
  wallpapers = map.wallpapers
  stages = map.stages
  player = mapLoader.getPlayer(gameOver)
  winner = map.winner

  // reset all variables
  timeout = map.timeout
  elapsedTime = 0
  speed = min_speed
  playerTravelled = 0
  score.textContent = lastScore
  lifeEl.textContent = life
  actions.left.tapped = false
  actions.right.tapped = false
  isGameOver = false
  isGameWon = false
  timeoutKey = 0
  timeoutChecker()
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function setPlayerSpeed() {
  if (actions.right.tapped || actions.left.tapped) {
    speed += accelaration
    speed = speed > max_speed ? max_speed : speed
    score.textContent = Math.floor(playerTravelled) + lastScore
  }
}

function timeoutChecker() {
  let remain = timeout - ++elapsedTime
  remain = remain < 0 ? 0 : remain
  timeoutEl.textContent = remain
  if (!remain) {
    return gameOver()
  }
  if (isGameOver || isGameWon) {
    return
  }
  if (timeoutKey !== false) {
    timeoutKey = setTimeout(timeoutChecker, 1000)
  }
}

function animation() {
  //console.log('animation')
  // loop animation
  if (runAnimation) {
    requestAnimationFrame(animation)
  }
  if (isGameWon) {
    return
  }
  // clear canvas
  clearCanvas()

  // paint all objects
  drawAllObjects([wallpapers, backgrounds, stages])

  // paint player
  player.update(canvas, playerTravelled)

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
  if (actions.left.tapped && player.x > 500) {
    player.velocity.x = -speed
  } else if (actions.right.tapped && player.x < 500) {
    player.velocity.x = speed
  } else {
    player.velocity.x = 0
    if (actions.right.tapped) {
      playerTravelled += speed
      // move stage to the left
      stages.forEach((stage) => {
        stage.x -= speed
      })
      // move background to the left
      backgrounds.forEach((background) => {
        background.x -= speed * 0.66
      })
      // move wallpapers to the left
      wallpapers.forEach((wallpaper) => {
        wallpaper.x -= speed
      })
    } else if (actions.left.tapped && playerTravelled > speed) {
      playerTravelled -= speed
      // move stage to the right
      stages.forEach((stage) => {
        stage.x += speed
      })
      // move wallpapers to the right
      wallpapers.forEach((wallpaper) => {
        wallpaper.x += speed
      })
      // move background to the right
      backgrounds.forEach((background) => {
        background.x += speed * 0.66
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
    } else if (
      stage.type === 'hanger' &&
      player.x + player.width >= stage.x &&
      player.x + player.width < stage.x + stage.width &&
      ((player.y < stage.y && player.y + player.height > stage.y + 1) ||
        (player.y >= stage.y && player.y + player.height > stage.y + 1))
    ) {
      player.x -= speed
    } /*else if(
      stage.type === "hanger" &&
      player.state === "run-left" &&
      ((stage.x + stage.width <= player.x)  ) &&
      ((player.x - (stage.x + stage.width)) <= max_speed  ) &&
      ((player.x - (stage.x + stage.width)) >= 0  ) &&
      ((player.y < stage.y && player.y + player.height > stage.y+3) || (player.y >= stage.y && player.y + player.height > stage.y+3))
    ){
      console.log(stage.obj.id)
      player.velocity.x = 0;
    }*/
  })
}

function drawObjects(objs) {
  objs.forEach((obj) => {
    obj.draw(ctx)
  })
}

function drawAllObjects(collections) {
  collections.forEach((item) => {
    drawObjects(item)
  })
}

window.addEventListener('load', () => {
  setMap()
  animation()
})

window.addEventListener('blur', () => {
  runAnimation = false
  clearTimeout(timeoutKey)
  timeoutKey = false
})

window.addEventListener('focus', () => {
  if (runAnimation === false && timeoutKey === false) {
    runAnimation = true
    timeoutKey = 0
    timeoutChecker()
    animation()
  }
})

window.addEventListener('keydown', ({ key, keyCode }) => {
  //console.log(key, keyCode)
  switch (keyCode) {
    case /*' '*/ 32:
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
