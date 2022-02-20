
export default class Wallpaper{
  constructor(x=100,y=100,img, width){
    this.x = x;
    this.y = y;
    this.image = img;
    if(img){
      this.width = width ? width : this.image.width;
      this.height = this.image.height;
    }
  }

  draw(ctx){
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
