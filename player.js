export default class Player{
  gravity = 0.5;
  constructor(x=100,y=100,width=50,height=50){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = {
     x : 0,
     y : 0 
    }
  }

  onGameOver(gameOver){
    this.gameOver = gameOver;
  }

  draw(ctx){
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(ctx, canvas){
    this.draw(ctx);
    this.y += this.velocity.y;
    this.x += this.velocity.x;

    if(this.y + this.height + this.velocity.y <= canvas.height){
      this.velocity.y += this.gravity;
    }else{
      //this.velocity.y = 0;
      console.log('game over');
      this.gameOver();
    }
  }
  
}