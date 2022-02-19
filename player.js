export default class Player{
  gravity = 0.5;
  constructor(x=100,y=100,width=20,height=20){
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
    //ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
    //ctx.stroke();
    ctx.fill();
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