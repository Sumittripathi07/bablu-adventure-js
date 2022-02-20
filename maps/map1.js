import castle from '../assets/images/castle.png';
import background from '../assets/images/cloud.png';
import hanger from '../assets/images/hanger.png';
import stage from '../assets/images/stage.png';
import Background from '../background';
import Player from '../player';
import Stage from '../stage';
import Wallpaper from '../wallpaper';

let stageImg = new Image();
stageImg.src = stage;

let hangerImg = new Image();
hangerImg.src = hanger;

let castleImg = new Image();
castleImg.src = castle;

let backgroundImg = new Image();
backgroundImg.src = background;

let player = new Player(100,100,20,20);

export default class StageMap{
  constructor(canvas){
    this.canvas = canvas;
  }

  objCopy(times, cls){
    return function(x,y,img,width,height){
      return Array.from({length: times}, (v,i) => new cls(x + (i* (width ? width : img.width)),y,img,width,height));
    }
  }

  winScore(){
    return 8410;
  }

  timeout(){
    return 30;
  }

  stages(){
    return [
      new Stage(0,this.canvas.height - 180,stageImg), 
      new Stage(stageImg.width,this.canvas.height - 180,stageImg, 600),
      new Stage(stageImg.width + 1000,this.canvas.height - 180,stageImg, 600),
      new Stage(stageImg.width*2 + 800,this.canvas.height - 180,stageImg, 600),
      new Stage(stageImg.width*3 + 390 ,this.canvas.height - 320,hangerImg),
      ...this.objCopy(2,Stage)(stageImg.width*3 + 600 ,this.canvas.height - 460,hangerImg),
      new Stage(stageImg.width*3 + 1200,this.canvas.height - 180,stageImg, 600),
      ...this.objCopy(2,Stage)(stageImg.width*4 + 950 ,this.canvas.height - 320,hangerImg),
      new Stage(stageImg.width*4 + 950 + (hangerImg.width*2) + 30 ,this.canvas.height - 460,hangerImg),
      new Stage(stageImg.width*4 + 950 + (hangerImg.width*3) + 200 ,this.canvas.height - 460,hangerImg),
      new Stage(stageImg.width*4 + 950 + (hangerImg.width*4) + 370 ,this.canvas.height - 360,hangerImg),
      new Stage(stageImg.width*4 + 950 + (hangerImg.width*4) + 550,this.canvas.height - 180,stageImg), 
      ...this.objCopy(3,Stage)(stageImg.width*5 + 1250 + (hangerImg.width*4) + 550,this.canvas.height - 180,stageImg)
    ]
  }
  wallpapers(){
    return [
      new Wallpaper(stageImg.width*6 + 1250 + (hangerImg.width*4) + 900,this.canvas.height - (stageImg.height+230),castleImg),
    ]
  }

  backgrounds(){
    return [
      ...this.objCopy(3,Background)(0,0,backgroundImg),
    ]
  }

  player(ctx, gameOver){
    player = new Player(100,100,30,30);
    player.onGameOver(gameOver);
    player.update(ctx,this.canvas);
    return player;
  }
}