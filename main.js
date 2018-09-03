//Configuración del Canvas
let canvas = document.getElementsByTagName("canvas")[0]
let ctx = canvas.getContext("2d")

//------------------------------------------------------------------//
//Test del canvas
//ctx.fillRect(0,0,canvas.width,canvas.height)

//------------------------------------------------------------------//
//Varibles globales  
let backgroundImages = {
 montains: "./backgrounds/backgroundMountains.png",
 darkMontains: "./backgrounds/nightMontain.png"
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
let iconImages = {
  mute: "./Icons/mute.png",
  sound: "./Icons/sound.png"
}
let frames = 0
let interval = null
let startScreenInterval = null

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
    this.music = new Audio()
    this.music.src = "./music.mp3"
    this.music.loop = true
  }

  draw(){
    ctx.drawImage(this.bg,this.x,this.y,this.width,this.height)
    ctx.drawImage(this.bg,this.x+canvas.width,this.y,this.width,this.height)
    ctx.font = "50px VT323"
    ctx.fillStyle = "white"
    ctx.fillText(Math.floor(frames/60),100,100)
  }

  moveBG(){
    this.x-=8
    if(this.x<-canvas.width){ 
      this.x =0
    }
  }

} //Termina clase Board
class StartScreen{
  constructor(){
    this.x =0
    this.y =0
    this.width = canvas.width
    this.height = canvas.height
    this.bg = new Image()
    this.bg.src = backgroundImages.darkMontains
    this.music = new Audio()
    this.music.src = "./despacito.mp3"
    this.music.loop = true
    this.audioIcon = new Image()
    this.audioIcon.src = iconImages.mute
    this.titlesPosX = 100
    this.titlesPosY = 250
    this.titleDirection = 1 // La dirección es hacia abajo
  }

  moveBG(){
    this.titlesPosY+=8/15*this.titleDirection
    if(this.titlesPosY>280){ 
      this.titleDirection = -1
    }
    if(this.titlesPosY<250){
      this.titleDirection = 1
    }
  }
  drawStartScreen(){
    ctx.drawImage(this.bg,this.x,this.y,this.width,this.height)
    ctx.drawImage(this.audioIcon,950,20,50,50)
    this.moveBG()
    ctx.font = "80px VT323"
    ctx.fillStyle = "gray"
    ctx.fillText("Insert a Gatopulpo to Start",this.titlesPosX+6,this.titlesPosY+6)
    ctx.fillStyle = "white"
    ctx.fillText("Insert a Gatopulpo to Start",this.titlesPosX,this.titlesPosY)
  }
} //Termina clase startScreen
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

} //Termina clase Player

//------------------------------------------------------------------//
//Instacias
let startScr= new StartScreen()
let board = new Board()
let player1 = new Player(1)
let player2 = new Player(2)

//------------------------------------------------------------------//
//Funciones principales
function start(){
  if (interval) return
  startScr.music.pause() //pausa la música de la pantalla de inicio
  clearInterval(startScreenInterval)
  startScreenInterval = null
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
function updateStartScreen(){
  ctx.clearRect(0,0,canvas.width,canvas.height) //Borra todo el canvas
  startScr.drawStartScreen()
}
function loadScreenAnimation(){
  if (startScreenInterval) return
  startScreenInterval = setInterval(updateStartScreen,1000/60)
}

//------------------------------------------------------------------//
//Los observadores (listeners)
addEventListener("keydown",function(e){
  //--------------PLAYER1----------------//
  if(e.key == "Enter"){
    start()
    board.music.play()
}//Comenzar
  if (e.keyCode== 68) {
    if(player1.posX>760){
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
addEventListener("keyup",function(e){ //Funcion para regresar el sprite  del jugador a idle
  player1.sprite.src = characterSprites.characterIdle
})
addEventListener("load",function(){ //Coloca la pantalla de inicio
  startScr.drawStartScreen()
  loadScreenAnimation()
})
canvas.addEventListener("click",function(e){
  let xClick = e.pageX
  let yClick = e.pageY
  if(xClick>1080 && xClick<1140 && yClick>100 && yClick<150){ //Colocando coordenadas del ícono de sonido 
  if (startScr.audioIcon.src[startScr.audioIcon.src.length-5] == "e") { //¿Está en mute?
    startScr.audioIcon.src = iconImages.sound //cambiar ícono
    startScr.music.play() 
  }else  if (startScr.audioIcon.src[startScr.audioIcon.src.length-5] == "d") { //¿Está en sound?
    startScr.music.pause()
    startScr.audioIcon.src = iconImages.mute //cambiar ícono
  }
}
})