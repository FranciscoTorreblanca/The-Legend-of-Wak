//Configuración del Canvas
let canvas = document.getElementsByTagName("canvas")[0]
let ctx = canvas.getContext("2d")

//------------------------------------------------------------------//
//Test del canvas
//ctx.fillRect(0,0,canvas.width,canvas.height)

//------------------------------------------------------------------//
//Varibles globales  
let wFrame =1;
let images = {
 backgroundMontains: "./backgroundMountains.png",
 characterBow: "./characterBow.png",
 characterSprites: "./characterSprites.png"
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
    this.bg.src = images.backgroundMontains
    this.bg.onload = ()=>{ this.draw() } //dibujar el board
    this.music = new Audio()
    this.music.src = "music.mp3"
  }

  draw(){
    ctx.drawImage(this.bg,this.x,this.y,this.width,this.height)
    ctx.drawImage(this.bg,this.x+canvas.width,this.y,this.width,this.height)
    ctx.font = "50px Avenir"
    ctx.fillStyle = "white"
    ctx.fillText(Math.floor(frames/60),100,100)
  }

  moveBG(){
    this.x-=5
    if(this.x<-canvas.width) this.x =0
  }
} //Aqui termina la clase Board
class Player{
  constructor(numPlayer){
    this.y = 0
    this.posX = 50
    this.posY = 300
    this.width = 50
    this.height = 37
    this.player = numPlayer
    this.sprite = new Image
    this.sprite.src = images.characterSprites
    this.posXInicioSprite = 100
    this.posYInicioSprite = 37*8
    this.x = this.posXInicioSprite
  }

  draw(){
    if(frames%10==0) this.changeSprite()   
    ctx.drawImage(this.sprite,this.x,this.y,this.width,this.height,this.posX,this.posY,120,150) 
  }

  changeSprite(){
    this.y = this.posYInicioSprite
    this.x += this.width //cambia el sprite
    if(this.x>=50*7) {
      this.x =  this.posXInicioSprite
      this.posYInicioSprite =37*8
    }
    
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
  if(e.key == "Enter"){
    start()
    board.music.play()
}//Comenzar
  if (e.key== "d") {
    if(player1.posX>700){
      board.moveBG()
      return
    }
    player1.posX+=5
    console.log("hoal")
  }//mover izquierda player 1

  if (e.key== "a") {
    player1.posX-=5
    console.log("izq")
  }//mover izquierda player 1
})
