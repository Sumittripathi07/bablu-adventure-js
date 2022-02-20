
import gameOverSound from './assets/sounds/gameover.mp3';

export default class GameOver{
  constructor(x=100,y=100,img, width){
    this.x = x;
    this.y = y;
    this.image = img;
    if(img){
      this.width = width ? width : this.image.width;
      this.height = this.image.height;
    }
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
