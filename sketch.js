var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var coinsGroup, coinImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score=0;

var gameOver, restart;



function preload(){
  mario_running =   loadAnimation("Capture1.png","Capture3.png","Capture4.png");
  mario_collided = loadAnimation("mariodead.png");
  
  groundImage = loadImage("backg.jpg");
  
  coinImage = loadImage("coin.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  mario = createSprite(50,180,20,50);
  
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,800,10);
  invisibleGround.visible = true;
  
  coinsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //mario.debug = true;
  background(255);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && mario.y >= 150) {
      mario.velocityY = -12;
    }
   console.log(mario.y)
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    mario.collide(invisibleGround);
    spawnCoins();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(mario)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    
    //change the mario animation
    mario.changeAnimation("collided",mario_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnCoins() {
  //write code here to spawn the coins
  if (frameCount % 60 === 0) {
    var coin = createSprite(600,120,40,10);
    coin.y = Math.round(random(80,120));
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each coin to the group
    coinsGroup.add(coin);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinsGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  
 
  
  score = 0;
  
}