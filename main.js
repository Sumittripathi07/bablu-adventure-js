import gameOverImgPath from './assets/images/gameover.png';
import GameOver from './gameover.js';
import load from './maps/index.js';

const canvas= document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const score = document.querySelector('#score');
const mapid = document.querySelector('#mapid');
const lifeEl = document.querySelector('#life');
const min_speed = 5;
const max_speed = 15
const accelaration = 0.25;

canvas.width = 1400; 
canvas.height = 770;

const actions = {
  right : {
    tapped: false,
  },
  left : {
    tapped: false,
  },
}

// variable declarations
let currentMap = 1;
let totalMaps = 2;
let life =3;

let player;
let winScore;
let lastScore = 0;
let backgrounds=[];
let stages = [];
let wallpapers = [];
let playerTravelled = 0;
let speed = min_speed;
let isGameOver =false;
let isGameWon =false;

let gameOverImg = new Image();
gameOverImg.src = gameOverImgPath;
let gameOverObj = new GameOver(570,250,gameOverImg);


function gameOver(wait=3000){
  if(isGameOver) return;
  isGameOver =true;
  player.dead();
  player.velocity.x = 0;
  player.velocity.y = -30;
  setTimeout(()=>{ --life},wait);
  if(life <= 1){
    lifeEl.textContent = life;
    setTimeout(()=>gameOverObj.playGameOverSound(), wait+200) ;
    return;
  }
  setTimeout(resetMap, wait);
}

function gameWon(wait=6000){
  if(isGameWon) return;
  isGameWon =true;
  player.clear();
  player.velocity.x = 0;
  player.velocity.y = 0;
  if(currentMap < totalMaps){
    currentMap++;
  }else{
    currentMap = 1;
  }
  setTimeout(resetMap, wait);
}



// reset and load map
function resetMap(){
  //console.log('currentMap', currentMap);
  lastScore += Math.floor(playerTravelled);
  mapid.textContent = currentMap;
  const map = load(currentMap, canvas);
  backgrounds = map.backgrounds();
  wallpapers = map.wallpapers();
  stages = map.stages();
  player = map.player(ctx,gameOver);
  winScore = map.winScore();

  // reset all variables
  speed = min_speed;
  playerTravelled = 0;
  score.textContent = lastScore;
  lifeEl.textContent = life;
  actions.left.tapped = false;
  actions.right.tapped = false;
  isGameOver = false;
  isGameWon = false;
}

function clearCanvas(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function setPlayerSpeed(){
  if(actions.right.tapped || actions.left.tapped){
    speed += accelaration;
    speed = speed > max_speed ? max_speed : speed;
    score.textContent = Math.floor(playerTravelled) + lastScore;
  }
}


function animation(){
  // continues animation
  requestAnimationFrame(animation);

  if(isGameWon){
    return;
  }

  // clear canvas
  clearCanvas();
 
  // draw all backgrounds
  backgrounds.forEach(background => {
    background.draw(ctx)
  })

  // draw all stages
  stages.forEach(stage => {
    stage.draw(ctx)
  })

  // draw all wallpapers
  wallpapers.forEach(wallpaper => {
    wallpaper.draw(ctx)
  });
   
  // painting player
  player.update(ctx,canvas);

  if(life <= 0){
    gameOverObj.draw(ctx, canvas); 
  }

  if(isGameOver){
    return;
  }

  //set player speed
  setPlayerSpeed();
  
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
        background.x -= speed 
      });


      // move wallpapers to the left
      wallpapers.forEach(wallpaper => {
        wallpaper.x -= speed;
      });



    }else if(actions.left.tapped && playerTravelled > 1){
      
      playerTravelled -= speed;

      // move stage to the right
      stages.forEach(stage => {
        stage.x += speed;
      });

      // move wallpapers to the right
      wallpapers.forEach(wallpaper => {
        wallpaper.x += speed;
      });

      // move background to the right
      backgrounds.forEach(background => {
        background.x += speed * .66;
      });
    }

    if(playerTravelled >= winScore){
      gameWon();
    }

  }

  // movement and stage painting and collision detection
  stages.forEach(stage => {

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
      player.x <= stage.x + stage.width ){
      player.velocity.y = 0;
    }
  });
}

resetMap();
animation();

window.addEventListener('keydown',({key})=>{
  switch(key){
    // jump
    case ' ':  
      // to check if player is on the ground
      if(player.velocity.y === 0){ 
        player.jump();    
      }
      break;
    case 'ArrowLeft':
      actions.left.tapped = true;     
      break;
    case 'ArrowRight':
    actions.right.tapped = true;
    break;
  }
});

window.addEventListener('keyup',({key})=>{
  switch(key){
    case ' ':       
      break;
    case 'ArrowDown':
      break;
    case 'ArrowLeft':
      actions.left.tapped = false;
      speed = min_speed;
      break;
    case 'ArrowRight':
      actions.right.tapped = false;
      speed = min_speed;
      break;
  }
});