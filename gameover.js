
import gameOverImgPath from './assets/images/gameover.png';
import gameOverSound from './assets/sounds/gameover.mp3';

export default class GameOver{
  constructor(x=100,y=100, width, height){
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = gameOverImgPath;;
    this.width = width ? width : this.image.width;
    this.height = height ? height : this.image.height;
    this.gameOverSound = new Audio(gameOverSound);
  }

  draw(ctx,canvas){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  playGameOverSound(){
    this.gameOverSound.currentTime = 0;
    this.gameOverSound.play();
  }
}
