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
  walkLeft: "./enemiesSprites/golemWalkLeft.png",
  walk: "./enemiesSprites/golemWalk.png",
  attack: "./enemiesSprites/golemAttack.png",
  attackLeft: "./enemiesSprites/golemAttackLeft.png",
  die: "./enemiesSprites/golemDie.png"
}
let iconImages = {
  mute: "./Icons/mute.png",
  sound: "./Icons/sound.png"
}
let frames = 0
let interval = null //para el update general
let startScreenInterval = null //para estar actualizando la pantalla de inicio
let jumpInterval = null // para estar actualizando los sprites del jump
let attackInterval = null //para actualizar los sprites del attack
let isPlaying = false // booleano para llevar control entre pantalla de GameOver- patalla de incio - pantalla de Juego
let enemiesArray = []

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
    this.x-=7
    if(this.x<-canvas.width){ 
      this.x =0
    }
    enemiesArray.forEach(function(enemy){
      enemy.posX-=7
    })
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
    this.health = 3
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
    if(!jumpInterval && !attackInterval) this.sprite.src = characterSprites.characterRunLeft
    if(!attackInterval) this.posX-=5
  }

  moveRigth(){ //mueve al juador a la derecha
    if(!jumpInterval && !attackInterval) this.sprite.src = characterSprites.characterRun
    if(!attackInterval) this.posX+=5
  }

  moveUp(){ //mueve al jugador hacia arriba
    if(!jumpInterval && !attackInterval) {
      this.sprite.src=characterSprites.characterWalk
      this.posY-=4
    }
  }

  moveDown(){ //mueve al jugador hacia abajo
    if(!jumpInterval && !attackInterval) {
      this.sprite.src=characterSprites.characterWalk
      this.posY+=4
    }
  }

  jump(){ //hace saltar al jugador
    this.sprite.src = characterSprites.characterJump
    this.posY-=5*this.jumpDirection
    if (this.posY<150) {
      this.jumpDirection = -1
    }
  }

  attack(){
    this.sprite.src= characterSprites.characterAttack
    if(frames%10 ==0) this.checkCollisions()
  }

  checkCollisions(){
    enemiesArray.forEach( (enemy)=>{
      if(this.crashWith(enemy)){
        enemy.health--
      } 
    })
  }
  crashWith(item){
    var crash = (this.posX < item.posX + 150) && //Detecta la colisión entre dos rectangulos (uno contiene al otro?)
                (this.posX + 120 > item.posX) 
    return crash;
  }
} //Termina clase Player
class Enemy{
  constructor(enemyID){
    //TODO: Diferentes Enemigos según ID
    this.health = 1
    this.x = 0
    this.y = 0
    this.posX= 1100
    this.posY = 270
    this.moveDirection = -1 //mueve a la izquierda
    this.width = 320
    this.height = 320
    this.inBoardHeight = 180
    this.sprite = new Image()
    this.imagesSource = golemSprites
    this.sprite.src = this.imagesSource.walkLeft
    this.isAtackking = false
  }

  draw(){ //dibuja al enemigo
    if(frames%10==0  ) this.changeSprite()   
    ctx.drawImage(this.sprite,this.x,this.y,this.width,this.height,this.posX,this.posY,150,this.inBoardHeight) 
  }

  changeSprite(){ //cambia el sprite
    if(this.health>0) this.moveToPlayer()
    else if(this.health<0&&this.health>-1000){
      if(this.y>0) this.y=0
        this.height= 320
        this.sprite.src = golemSprites.die
        this.health = -10000
    }
    this.y += this.height
    if(this.y>=this.sprite.naturalHeight && this.health>0) {
      this.y =0
    }
  }

  moveToPlayer(){
    if(!this.isAtackking && this.health>0){
      if(this.posX<player1.posX) {
        this.moveDirection = 1
        this.height = 320
        this.posY = 270
        this.inBoardHeight = 180
        this.sprite.src = golemSprites.walk
      } else if(this.posX>player1.posX){
        this.moveDirection = -1
        this.height = 320
        this.posY = 270
        this.inBoardHeight = 180
        this.sprite.src = golemSprites.walkLeft
      }
      this.posX +=5*this.moveDirection
      if(this.posX>player1.posX && this.posX<player1.posX+80){
        this.inBoardHeight = 270
        this.posY = 180
        this.attackPlayer("Left")
      }
      if(this.posX<player1.posX && this.posX>player1.posX-80){
        this.posY = 180 
        this.inBoardHeight = 270
        this.attackPlayer("Right")
      }
    }
  }

  attackPlayer(side){
    if(side==="Left"){
      this.sprite.src = this.imagesSource.attackLeft
      this.height = 480
      this.y =0
      this.isAtackking = true
      setTimeout(()=>{
        this.isAtackking = false
      },800)
    }else if(side === "Right"){
      this.sprite.src = this.imagesSource.attack
      this.height = 480
      this.y =0
      this.isAtackking = true
      setTimeout(()=>{
        this.isAtackking = false
      },800)
    }
  }

  checkCollisions(){

  }
}

//------------------------------------------------------------------//
//Instacias
let startScr= new StartScreen()
let board = new Board()
let player1 = new Player(1)
let player2 = new Player(2)


//------------------------------------------------------------------//
//Funciones principales
function start(){ //Funció que hace iniciar el juego
  if (interval) return
  startScr.music.pause() //pausa la música de la pantalla de inicio
  clearInterval(startScreenInterval)
  startScreenInterval = null
  interval = setInterval(update,1000/80)
  //-------AQUI EMPIEZAN LOS OBSERVADORES PARA HACER QUE PRESIONE VARIAS TECLAS ------ //
  window.addEventListener('keydown', function (e) {
    board.keys = (board.keys || []);
    board.keys[e.keyCode] = true;
  })
  window.addEventListener('keyup', function (e) {
    board.keys[e.keyCode] = false; 
    player1.sprite.src = characterSprites.characterIdle
  })
//-------AQUI TERMINAN LOS OBSERVADORES PARA HACER QUE PRESIONE VARIAS TECLAS ------ //
}
function update(){
  ctx.clearRect(0,0,canvas.width,canvas.height) //Borra todo el canvas
  board.draw()
  if(frames%1000==0) createEnemies(1)
  enemiesArray.forEach(function(enemy){
    if(enemy.posX<-120){
      enemiesArray.shift()
      return
    }
    enemy.draw()
  })
  if (board.keys && board.keys[68] && isPlaying) {
    if(player1.posX>760 && !attackInterval){
      board.moveBG()
      
      if(!jumpInterval) player1.sprite.src = characterSprites.characterRun
      //return
    }else {
      player1.moveRigth()
    }
  }
  if (board.keys && board.keys[65] && isPlaying) {
    if(player1.posX<50) {
      player1.sprite.src = characterSprites.characterIdle
      //return
    }else {
      player1.moveLeft()
    }
  }
  if (board.keys && board.keys[87] && isPlaying) {
    if(player1.posY>280) player1.moveUp()
   }
  if (board.keys && board.keys[83] && isPlaying) {
    if(player1.posY<320) player1.moveDown()
   }
  
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
function jumpPlayer(){
  player1.jump()
}
function thePlayerAttack(){
   player1.attack()
}
function createEnemies(id){
  enemiesArray.push(new Enemy(id))
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
  if(e.keyCode==32){
    jumpInterval = setInterval(jumpPlayer,1000/60)
    setTimeout(function(){
      clearInterval(jumpInterval)
      jumpInterval = null
      player1.jumpDirection =1
      player1.sprite.src = characterSprites.characterIdle
    },1000)
  }
    if(e.keyCode == 90){
      if(attackInterval) return
        attackInterval = setInterval(thePlayerAttack,1000/60)
        setTimeout(function(){
          clearInterval(attackInterval)
          attackInterval = null
          player1.sprite.src = characterSprites.characterIdle
        },1000)
      
  } //hace saltar al jugador
}
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