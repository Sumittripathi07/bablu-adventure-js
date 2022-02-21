import clearSound from './assets/sounds/clear.mp3';
import deadSound from './assets/sounds/dead.mp3';
import jumpSound from './assets/sounds/jump.mp3';

export default class Player{
  gravity = 1.3;
  constructor(x=100,y=100,width=20,height=20){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = {
     x : 5,
     y : 0.5 
    }
    this.jumpSound = new Audio(jumpSound);
    this.deadSound = new Audio(deadSound);
    this.clearSound = new Audio(clearSound);
    this.isGameOver =false;
    this.lastX =null;
    this.lastY =null;
    this.lastPlayerTravelled =null;
  }

  onGameOver(gameOver){
    this.gameOver = gameOver;
  }

  draw(ctx){
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(ctx, canvas, playerTravelled){
    if(this.lastX !== this.x || this.lastY !== this.y || this.lastPlayerTravelled !== playerTravelled){
      this.draw(ctx);
      this.lastX = this.x;
      this.lastY = this.y;
      this.lastPlayerTravelled = playerTravelled;
    }
    this.y += this.velocity.y;
    this.x += this.velocity.x;

    if(this.y + this.height + this.velocity.y <= canvas.height){
      this.velocity.y += this.gravity;
    }else{
      if(!this.isGameOver){
        this.velocity.y = 0;
      }
      this.isGameOver =true;
      this.gameOver();
    }
  }

  jump(){
    this.jumpSound.currentTime = 0;
    this.jumpSound.play();
    this.velocity.y = -20;
  }

  dead(){
    this.deadSound.currentTime = 0;
    this.deadSound.play();
  }
  clear(){
    this.clearSound.currentTime = 0;
    this.clearSound.play();
  }
  
}