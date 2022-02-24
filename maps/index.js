import bush from '../assets/images/bush.png'
import castle from '../assets/images/castle.png'
import background from '../assets/images/cloud.png'
import hanger from '../assets/images/hanger.png'
import stage from '../assets/images/stage.png'
import Background from '../background'
import Player from '../player'
import Stage from '../stage'
import Wallpaper from '../wallpaper'
import map1 from './map1.js'
import map2 from './map2.js'

let stageImg = new Image()
stageImg.src = stage

let hangerImg = new Image()
hangerImg.src = hanger

let castleImg = new Image()
castleImg.src = castle

let bushImg = new Image()
bushImg.src = bush

let backgroundImg = new Image()
backgroundImg.src = background

let player = new Player(100, 100, 20, 20)

export default class MapLoader {
  objectXYs = {}

  constructor(ctx, canvas) {
    this.ctx = ctx
    this.canvas = canvas
  }
  getImage(img) {
    switch (img) {
      case 'stage':
        return stageImg
      case 'hanger':
        return hangerImg
      case 'castle':
        return castleImg
      case 'background':
        return backgroundImg
      case 'bush':
        return bushImg
      default:
        return null
    }
  }
  getObject(objName) {
    switch (objName) {
      case 'stage':
        return Stage
      case 'player':
        return Player
      case 'background':
        return Background
      case 'wallpaper':
        return Wallpaper
      default:
        return null
    }
  }

  getWidth(obj, img) {
    return obj.width ? obj.width : img ? img.width : 0
  }

  repeatObject(times, cls) {
    let that = this
    return function (x, y, img, width, height, obj) {
      return Array.from({ length: times }, (v, i) => {
        let retObj = new cls(
          x + i * (width ? width : img.width),
          y,
          img,
          width,
          height,
          obj
        )
        if (obj.winner) {
          obj.winner.x = obj.winner.x || 0
          that.winner = {
            obj: retObj,
            config: obj
          }
        }
        return retObj
      })
    }
  }

  getPlayer(gameOver) {
    player = new Player(this.ctx)
    player.onGameOver(gameOver)
    player.update(this.canvas)
    return player
  }

  flat(arr) {
    return arr.reduce((acc, curr) => acc.concat(curr), [])
  }

  loadObjects(objs, name) {
    const that = this
    let currentX = 0
    return objs.map((obj) => {
      obj.x = obj.x || 0
      obj.y = obj.y || 0
      let x = obj.x ? obj.x : 0
      let y = obj.y < 0 ? that.canvas.height + obj.y : obj.y
      let img = that.getImage(obj.image)
      let width = obj.width || that.getWidth(obj, img)

      if (!obj.ignorePreviousBlocks && !obj.at) {
        x += currentX
      }

      if (
        obj &&
        obj.at &&
        obj.at.id &&
        obj.at.from === 'end' &&
        that.objectXYs[obj.at.id]
      ) {
        if (typeof obj.x !== 'undefined') {
          x += that.objectXYs[obj.at.id].x + that.objectXYs[obj.at.id].width
        }
        if (typeof obj.y !== 'undefined') {
          y = that.objectXYs[obj.at.id].y - img.height + (obj.y || 0)
        }
      } else if (
        obj &&
        obj.at &&
        obj.at.id &&
        obj.at.from === 'start' &&
        that.objectXYs[obj.at.id]
      ) {
        if (typeof obj.x !== 'undefined') {
          x += that.objectXYs[obj.at.id].x
        }

        if (typeof obj.y !== 'undefined') {
          y = that.objectXYs[obj.at.id].y - img.height + (obj.y || 0)
        }
      }

      currentX = x + width * (obj.repeat || 1)
      that.objectXYs[obj.id] = {
        x,
        y,
        width: width * (obj.repeat || 1),
        height: img.height
      }
      if (obj.repeat) {
        return that.repeatObject(obj.repeat, that.getObject(name))(
          x,
          y,
          img,
          width,
          null,
          obj
        )
      }

      let retObj = new (that.getObject(name))(x, y, img, width, null, obj)
      if (obj.winner) {
        obj.winner.x = obj.winner.x || 0
        that.winner = {
          obj: retObj,
          config: obj
        }
      }
      return retObj
    })
  }

  loadMap(mapObj, mapId) {
    let stages, backgrounds, wallpapers, winScore
    stages = this.loadObjects(mapObj.stages, 'stage')
    backgrounds = this.loadObjects(mapObj.backgrounds, 'background')
    wallpapers = this.loadObjects(mapObj.wallpapers, 'wallpaper')
    if (!this.winner) {
      throw Error(`No winner strategy found in map ${mapId}`)
    }
    return {
      stages: this.flat(stages),
      wallpapers: this.flat(wallpapers),
      backgrounds: this.flat(backgrounds),
      winner: this.winner,
      timeout: mapObj.timeout
    }
  }

  load(mapId) {
    switch (mapId) {
      case 2:
        return this.loadMap(map2, mapId)
      case 1:
      default:
        return this.loadMap(map1, mapId)
    }
  }
}
