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
  characterJump: "./characterSprites/characterJump.png",
  characterJumpKick: "./characterSprites/characterJumpKick.png",
  characterDamage: "./characterSprites/characterDamage.png",
  characterWalk: "./characterSprites/characterWalk.png",
  characterIdle: "./characterSprites/characterIdle.png",
  characterRunLeft: "./characterSprites/characterRunLeft.png",
  characterWalkLeft: "./characterSprites/characterWalkLeft.png"
}
let golemSprites = {
  walkLeft: "./enemiesSprites/golemWalkLeft.png"
}
let iconImages = {
  mute: "./Icons/mute.png",
  sound: "./Icons/sound.png"
}
let frames = 0
let interval = null //para el update general
let startScreenInterval = null //para estar actualizando la pantalla de inicio
let jumpInterval = null // para estar actualizando los sprites del jump
let isPlaying = false // booleano para llevar control entre pantalla de GameOver- patalla de incio - pantalla de Juego

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
    this.music.src = "./Music/music.mp3"
    this.music.loop = true
  }

  draw(){ //dibuja la pantalla del juego
    ctx.drawImage(this.bg,this.x,this.y,this.width,this.height)
    ctx.drawImage(this.bg,this.x+canvas.width,this.y,this.width,this.height)
    ctx.font = "50px VT323"
    ctx.fillStyle = "white"
    ctx.fillText(Math.floor(frames/60),100,100)
  }

  moveBG(){ //Mueve la imagen de fondo
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
    this.music.src = "./Music/despacito.mp3"
    this.music.loop = true
    this.audioIcon = new Image()
    this.audioIcon.src = iconImages.mute
    this.titlesPosX = 100
    this.titlesPosY = 250
    this.titleDirection = 1 // La dirección de la animacion del título es hacia abajo
  }

  moveBG(){ //mueve el título de inicio
    this.titlesPosY+=8/15*this.titleDirection
    if(this.titlesPosY>280){ 
      this.titleDirection = -1
    }
    if(this.titlesPosY<250){
      this.titleDirection = 1
    }
  }
  drawStartScreen(){ // dibuja la pantalla de inicio 
    //TODO: Animar nubes del fondo
    ctx.drawImage(this.bg,this.x,this.y,this.width,this.height)
    ctx.drawImage(this.audioIcon,950,20,50,50)
    this.moveBG()
    ctx.font = "80px VT323"
    ctx.fillStyle = "gray"
    ctx.fillText("Insert Gatopulpo to Start",this.titlesPosX+6,this.titlesPosY+6)
    ctx.fillStyle = "white"
    ctx.fillText("Insert Gatopulpo to Start",this.titlesPosX,this.titlesPosY)
  }
} //Termina clase startScreen
class Player{
  //TODO: Sprites + lógica del segundo 
  constructor(numPlayer){
    this.x =0 //x del pedazo de imagen a tomar del sprite
    this.y = 0 //y del pedazo de imagen a tomar del sprite
    this.posX = 100 //posicion X del jugador en la pantalla
    this.posY = 300 //posicion Y del jugador en la pantalla
    this.width = 250//Tamaño del ancho del pedazo de imagen a tomar del sprite
    this.height = 185//Tamaño del alto del pedazo de imagen a tomar del sprite
    this.player = numPlayer //variable para definir número de jugador
    this.sprite = new Image() //imagen que tomará el jugador
    this.sprite.src = characterSprites.characterIdle //En principio estará parado
    this.isJumping = false //bool para saber si está saltando
    this.jumpDirection = 1 //direccion del salto
  }

  draw(){ //dibuja al jugador
    if(frames%10==0) this.changeSprite()   
    ctx.drawImage(this.sprite,this.x,this.y,this.width,this.height,this.posX,this.posY,120,150) 
  }

  changeSprite(){ //cambia el sprite
    this.y += this.height
    if(this.y>=this.sprite.naturalHeight) {
      this.y =0
    }
  }

  moveLeft(){ //mueve al jugador a la izquiera
    this.sprite.src = characterSprites.characterRunLeft
    this.posX-=7
  }

  moveRigth(){ //mueve al juador a la derecha
    this.sprite.src = characterSprites.characterRun
    this.posX+=7
  }

  moveUp(){ //mueve al jugador hacia arriba
    this.sprite.src=characterSprites.characterWalk
    this.posY-=4
  }

  moveDown(){ //mueve al jugador hacia abajo
    this.sprite.src=characterSprites.characterWalk
    this.posY+=4
  }

  jump(){ //hace saltar al jugador
    this.sprite.src = characterSprites.characterJump
    this.posY-=5*this.jumpDirection
    if (this.posY<150) {
      this.jumpDirection = -1
    }
  }

} //Termina clase Player
class Enemy{
  constructor(enemyID){
    //TODO: Diferentes Enemigos según ID
    this.x = 0
    this.y = 0
    this.posX= 1100
    this.posY = 270
    this.moveDirection = -1 //mueve a la izquierda
    this.width = 320
    this.height = 320
    this.sprite = new Image()
    this.sprite.src = golemSprites.walkLeft
  }

  draw(){ //dibuja al enemigo
    if(frames%10==0) this.changeSprite()   
    ctx.drawImage(this.sprite,this.x,this.y,this.width,this.height,this.posX,this.posY,150,180) 
  }

  changeSprite(){ //cambia el sprite
    this.moveToPlayer()
    this.y += this.height
    if(this.y>=this.sprite.naturalHeight) {
      this.y =0
    }
  }

  moveToPlayer(){
    this.posX +=5*this.moveDirection
  }

  attackPlayer(){

    }
}

//------------------------------------------------------------------//
//Instacias
let startScr= new StartScreen()
let board = new Board()
let player1 = new Player(1)
let player2 = new Player(2)
let golem = new Enemy(1)

//------------------------------------------------------------------//
//Funciones principales
function start(){ //Funció que hace iniciar el juego
  if (interval) return
  startScr.music.pause() //pausa la música de la pantalla de inicio
  clearInterval(startScreenInterval)
  startScreenInterval = null
  interval = setInterval(update,1000/80)
}
function update(){
  ctx.clearRect(0,0,canvas.width,canvas.height) //Borra todo el canvas
  board.draw()
  player1.draw()
  golem.draw()
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

function jumpPlayer(){
  player1.jump()
}

//------------------------------------------------------------------//
//Los observadores (listeners)
addEventListener("keydown",function(e){
  //--------------PLAYER1----------------//
  if(jumpInterval) return
  if(e.key == "Enter"){
    start()
    board.music.play()
    isPlaying = true
}//Comenzar
if(isPlaying){
  if (e.keyCode== 68) {
    if(player1.posX>760){
      board.moveBG()
      player1.sprite.src = characterSprites.characterRun
      return
    }
    player1.moveRigth()
  }//mover derecha player 1

  if (e.keyCode== 65) {
    if(player1.posX<50) {
      player1.sprite.src = characterSprites.characterIdle
      return
    }
    player1.moveLeft()
  }//mover izquierda player 1

  if(e.keyCode ==87){
    if(player1.posY<280) return
    player1.moveUp()
  } //mover hacia arriba

  if(e.keyCode ==83){
    if(player1.posY>320) return
    player1.moveDown()
  } //mover hacia abajo

  if(e.keyCode==32){
    jumpInterval = setInterval(jumpPlayer,1000/60)
    setTimeout(function(){
      clearInterval(jumpInterval)
      jumpInterval = null
      player1.jumpDirection =1
      player1.sprite.src = characterSprites.characterIdle
    },1000)
  } //hace saltar al jugador
}
})
addEventListener("keyup",function(e){ //Funcion para regresar el sprite  del jugador a idle
  player1.sprite.src = characterSprites.characterIdle
})
addEventListener("load",function(){ //Coloca la pantalla de inicio
  startScr.drawStartScreen()
  loadScreenAnimation()
})
canvas.addEventListener("click",function(e){ //Click para el sonido de la pantalla de inicio
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