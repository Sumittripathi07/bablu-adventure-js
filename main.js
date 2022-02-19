import backgroundHills from './assets/hills.png';
import stage from './assets/stage.png';
import Background from './background';
import Player from './player';
import Stage from './stage';
import './style.css';


const canvas= document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const speed = 10;
let playerTravelled = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//const gravity = 0.5;

const actions = {
  right : {
    tapped: false,
  },
  left : {
    tapped: false,
  },
}


// variable declarations

let backgroundHillsImg;
let backgrounds=[];
let stageImg;
let stages = [];
let player;



function gameOver(){
  playerTravelled=0;
  initialRender();
  actions.right.tapped = false;
  actions.left.tapped = false;
}

function initialRender(){

  // create backgrounds
  backgroundHillsImg = new Image();
  backgroundHillsImg.src = backgroundHills;
  backgrounds = [
    new Background(0,0,backgroundHillsImg),
  ]

  // create stages
  stageImg = new Image();
  stageImg.src = stage;
  stages = [
    new Stage(0,canvas.height - 180,stageImg), 
    new Stage(stageImg.width,canvas.height - 180,stageImg, 600),
    new Stage(stageImg.width + 1100,canvas.height - 180,stageImg, 600),
    new Stage(stageImg.width*2 + 1100,canvas.height - 180,stageImg, 600)
  ];

  // create player
  player = new Player();
  player.onGameOver(gameOver);
  player.update(ctx,canvas);

}




function animation(){

  // continues animation
  requestAnimationFrame(animation);

  // clear canvas
  ctx.beginPath(); // to clear arc from canvas
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.closePath(); // to clear arc from canvas

  
  // draw all backgrounds
  backgrounds.forEach(background => {
    background.draw(ctx)
  })

  // draw all stages
  stages.forEach(stage => {
    stage.draw(ctx)
  })

   
  // painting player
  player.update(ctx,canvas);
  
  if(actions.left.tapped && player.x > 100){
    player.velocity.x = -speed;
  }else if(actions.right.tapped && player.x  < 400){
    player.velocity.x = speed;
  }else{
    if(actions.right.tapped){

      playerTravelled += speed;
      
      // move stage to the left
      stages.forEach(stage => {
        stage.x -= speed;
      });
      
      // move background to the left
      backgrounds.forEach(background => {
        background.x -= speed * .70;
      });

    }else if(actions.left.tapped && playerTravelled > 1){
      
      playerTravelled -= speed;

      // move stage to the right
      stages.forEach(stage => {
        stage.x += speed;
      });

      // move background to the right
      backgrounds.forEach(background => {
        background.x += speed * .66;
      });
    }

    if(playerTravelled >= 10000){
      console.log('you win the game')
    }
    console.log('playerTravelled', playerTravelled);
  }

  // movement and stage painting and collision detection
  stages.forEach(stage => {

    // to draw each stage
    stage.draw(ctx)

    
    // player movement right and left
    if(!(actions.left.tapped && player.x > 100 ) && !(actions.right.tapped && player.x  < 400)){
      player.velocity.x = 0; 
    }

    // player movement to last left corner
    if(actions.left.tapped && playerTravelled <= 0 && player.x > 1){
      player.velocity.x = -speed;
    }
  

    // to check if player is colliding with stage, movement on y-axis
    if(player.y + player.height <= stage.y && 
      player.y + player.height + player.velocity.y >= stage.y && 
      player.x + player.width >= stage.x &&  
      player.x <= stage.x + stage.width){       
      player.velocity.y = 0;
    }
  });
}

initialRender();
animation();

window.addEventListener('keydown',({key})=>{
  switch(key){
    // jump
    case ' ':  
      // to check if player is on the ground
      if(player.velocity.y === 0){     
        player.velocity.y = -15;
      }
      break;
    // down  
    case 'ArrowDown':
      //player.velocity.y = 10;
      break;

    // left  
    case 'ArrowLeft':
      actions.left.tapped = true;
      //player.velocity.x -= 10;
      break;

    // right  
    case 'ArrowRight':
    actions.right.tapped = true;
    // player.velocity.x = 1;
    break;
  }
});

window.addEventListener('keyup',({key})=>{
  switch(key){
    case ' ':       
      //player.velocity.y = -15;
      break;
    case 'ArrowDown':
      //player.velocity.y = 10;
      //break;
    case 'ArrowLeft':
      actions.left.tapped = false;
      //player.velocity.x = 0;
      break;
    case 'ArrowRight':
      actions.right.tapped = false;
      //player.velocity.x = 0;
      break;
  }
});