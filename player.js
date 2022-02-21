import playerRunLeft from './assets/images/player-run-left.png';
import playerRunRight from './assets/images/player-run-right.png';
import playerStandLeft from './assets/images/player-stand-left.png';
import playerStandRight from './assets/images/player-stand-right.png';
import clearSound from './assets/sounds/clear.mp3';
import deadSound from './assets/sounds/dead.mp3';
import jumpSound from './assets/sounds/jump.mp3';


function createImage(img){
  const image = new Image();
  image.src = img;
  return image;
}

export default class Player{
  gravity = 1.3;
  constructor(x=100,y=100,width=66,height=150){
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
    //this.lastX =null;
    //this.lastY =null;
    //this.lastPlayerTravelled =null;

    this.frames=0;
    this.sprites ={
      stand :{
        singleSnapWidth:177,
        width:66,
        right: createImage(playerStandRight),
        left: createImage(playerStandLeft)
      },
      run :{
        singleSnapWidth:341,
        width:127,
        right: createImage(playerRunRight),
        left: createImage(playerRunLeft)
      }
    }
    this.currentActivity = this.sprites.stand.right;
    this.currentSnapWidth = this.sprites.stand.singleSnapWidth;

  }

  changeActivity(activity){
    //this.currentActivity = activity;
    switch(activity){
      case 'stand-left':
        this.currentActivity = this.sprites.stand.left;
        this.currentSnapWidth = this.sprites.stand.singleSnapWidth;
        this.width = this.sprites.stand.width;
        break;
      case 'stand-right':
        this.currentActivity = this.sprites.stand.right;
        this.currentSnapWidth = this.sprites.stand.singleSnapWidth;
        this.width = this.sprites.stand.width;
        break;
      case 'run-left':
        this.currentActivity = this.sprites.run.left;
        this.currentSnapWidth = this.sprites.run.singleSnapWidth;
        this.width = this.sprites.run.width;
        break;
      case 'run-right':
        this.currentActivity = this.sprites.run.right;
        this.currentSnapWidth = this.sprites.run.singleSnapWidth;
        this.width = this.sprites.run.width;
        break;
    }
  }


  

  onGameOver(gameOver){
    this.gameOver = gameOver;
  }

  draw(ctx){
    //ctx.fillStyle = 'red';
    //ctx.fillRect(this.x, this.y, this.width, this.height);
    //console.log(this.currentSnapWidth * this.frames)
    ctx.drawImage(
      this.currentActivity, 
      this.currentSnapWidth * this.frames,
      0,
      this.currentSnapWidth,
      400,
      this.x, 
      this.y, 
      this.width ,
      this.height
    );
  }

  update(ctx, canvas, playerTravelled){
    // for optimization
    //if(this.lastX !== this.x || this.lastY !== this.y || this.lastPlayerTravelled !== playerTravelled){
      this.frames++;
      if(this.frames >= 30 && (this.currentActivity === this.sprites.run.right || this.currentActivity === this.sprites.run.left ) ){
        this.frames =0;
      }else if(this.frames >= 60){
        this.frames =0
      }
      this.draw(ctx);
      //this.lastX = this.x;
      //this.lastY = this.y;
      //this.lastPlayerTravelled = playerTravelled;
    //}
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