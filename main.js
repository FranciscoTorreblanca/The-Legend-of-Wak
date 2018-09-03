//Configuración del Canvas
let canvas = document.getElementsByTagName("canvas")[0]
let ctx = canvas.getContext("2d")

//------------------------------------------------------------------//
//Test del canvas
//ctx.fillRect(0,0,canvas.width,canvas.height)

//------------------------------------------------------------------//
//Varibles globales  
let backgroundImages = {
 montains: "./backgrounds/backgroundMountains.png"
}
let characterSprites = {
  characterBow: "./characterSprites/characterBow.png",
  characterKick: "./characterSprites/characterKick.png",
  characterAttack: "./characterSprites/characterAttack.png",
  characterRun: "./characterSprites/characterRun.png",
  characterJumpKick: "./characterSprites/characterJumpKick.png",
  characterDamage: "./characterSprites/characterDamage.png",
  characterWalk: "./characterSprites/characterWalk.png",
  characterIdle: "./characterSprites/characterIdle.png"
}
let frames = 0;
let interval = null

//------------------------------------------------------------------//
//Clases
class Board{
  constructor(){
    this.x =0
    this.y =0
    this.width = canvas.width
    this.height = canvas.height
    this.bg = new Image()
    this.bg.src = backgroundImages.montains
    this.bg.onload = ()=>{ this.draw() } //dibujar el board
    this.music = new Audio()
    this.music.src = "despacito.mp3"
    this.music.loop = true
  }

  draw(){
    ctx.drawImage(this.bg,this.x,this.y,this.width,this.height)
    ctx.drawImage(this.bg,this.x+canvas.width,this.y,this.width,this.height)
    ctx.font = "50px Avenir"
    ctx.fillStyle = "white"
    ctx.fillText(Math.floor(frames/60),100,100)
  }

  moveBG(){
    this.x-=8
    if(this.x<-canvas.width){ 
      this.x =0
    }
  }
} //Aqui termina la clase Board
class Player{
  constructor(numPlayer){
    this.x =0
    this.y = 0
    this.posX = 100
    this.posY = 300
    this.width = 250
    this.height = 185
    this.player = numPlayer
    this.sprite = new Image
    this.sprite.src = characterSprites.characterIdle
  }

  draw(){
    if(frames%10==0) this.changeSprite()   
    ctx.drawImage(this.sprite,this.x,this.y,this.width,this.height,this.posX,this.posY,120,150) 
  }

  changeSprite(){
    this.y += this.height
    if(this.y>=this.sprite.naturalHeight) {
      this.y =0
    }
  }

  moveLeft(){
    this.sprite.src = "./characterSprites/characterRunLeft.png"
    this.posX-=7
  }

  moveRigth(){
    this.sprite.src = "./characterSprites/characterRun.png"
    this.posX+=7
  }

}

//------------------------------------------------------------------//
//Instacias
let board = new Board();
let player1 = new Player(1);
let player2 = new Player(2);

//------------------------------------------------------------------//
//Funciones principales
function start(){
  if (interval) return
  console.log(board.music.duration)
  interval = setInterval(update,1000/60)
}
function update(){
  ctx.clearRect(0,0,canvas.width,canvas.height) //Borra todo el canvas
  board.draw()
  player1.draw()
  frames++
}

//------------------------------------------------------------------//
//Funciones auxiliares

//------------------------------------------------------------------//
//Los observadores (listeners)
addEventListener("keydown",function(e){
  //--------------PLAYER1----------------//
  if(e.key == "Enter"){
    start()
    board.music.play()
}//Comenzar
  if (e.keyCode== 68) {
    if(player1.posX>700){
      board.moveBG()
      player1.sprite.src = characterSprites.characterRun
      return
    }
    player1.moveRigth()
  }//mover izquierda player 1

  if (e.keyCode== 65) {
    if(player1.posX<50) {
      player1.sprite.src = characterSprites.characterIdle
      return
    }
    player1.moveLeft()
  }//mover izquierda player 1
})
addEventListener("keyup",function(e){
  player1.sprite.src = characterSprites.characterIdle
})
