//Configuración del Canvas
let canvas = document.getElementsByTagName("canvas")[0]
let ctx = canvas.getContext("2d")
let rect = canvas.getBoundingClientRect()

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
  die: "./enemiesSprites/golemDie.png",
  walkLeftP: "./enemiesSprites/golemWalkLeft.png",
  walkP: "./enemiesSprites/golemWalk.png",
  attackP: "./enemiesSprites/golemAttackParpadea.png",
  attackLeftP: "./enemiesSprites/golemAttackLeftParpadea.png"
}
let iconImages = {
  mute: "./Icons/mute.png",
  sound: "./Icons/sound.png"
}
let imagesHUD = {
  p17 : "./HUD/healtPlayer1-7.png",
  p16 : "./HUD/healtPlayer1-6.png",
  p15 : "./HUD/healtPlayer1-5.png",
  p14 : "./HUD/healtPlayer1-4.png",
  p13 : "./HUD/healtPlayer1-3.png",
  p12 : "./HUD/healtPlayer1-2.png",
  p11 : "./HUD/healtPlayer1-1.png",
  p10 : "./HUD/healtPlayer1-0.png"
}
let frames = 0
let interval = null //para el update general
let startScreenInterval = null //para estar actualizando la pantalla de inicio
let gameOverScreenInterval = null //para estar actualizando la pantalla de inicio
let parpadeaInterval = null //para parpadear personajes
let jumpInterval = null // para estar actualizando los sprites del jump
let jumpInterval2 = null // para estar actualizando los sprites del jump
let attackInterval = null //para actualizar los sprites del attack
let attackInterval2 = null //para actualizar los sprites del attack
let isPlaying = false // booleano para llevar control entre pantalla de GameOver- patalla de incio - pantalla de Juego
let enemiesArray = [] //Array de enemigos
let playerDamageInterval = null // para actualizar el sprite de Damage en el player
let playerDamageInterval2 = null

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
    this.numPlayer = numPlayer
    this.health = 7
    this.active = true
    if(numPlayer==2) this.active = false
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
    if(this.numPlayer==1){
      if(!jumpInterval && !attackInterval) this.sprite.src = characterSprites.characterRunLeft
      if(!attackInterval) this.posX-=5
    }
    if(this.numPlayer==2){
      if(!jumpInterval2 && !attackInterval2) this.sprite.src = characterSprites.characterRunLeft
      if(!attackInterval2) this.posX-=5
    }
  }

  moveRigth(){ //mueve al juador a la derecha
    if(this.numPlayer==1){
      if(!jumpInterval && !attackInterval) this.sprite.src = characterSprites.characterRun
      if(!attackInterval) this.posX+=5
    }
    if(this.numPlayer==2){
      if(!jumpInterval2 && !attackInterval2) this.sprite.src = characterSprites.characterRun
      if(!attackInterval2) this.posX+=5
    }
  }

  moveUp(){ //mueve al jugador hacia arriba
    if(this.numPlayer==1){
      if(!jumpInterval && !attackInterval) {
        this.sprite.src=characterSprites.characterWalk
        this.posY-=4
      }
    }
    if(this.numPlayer==1){
      if(!jumpInterval && !attackInterval) {
        this.sprite.src=characterSprites.characterWalk
        this.posY-=4
      }
    }
    if(this.numPlayer==2){
      if(!jumpInterval2 && !attackInterval2) {
        this.sprite.src=characterSprites.characterWalk
        this.posY-=4
      }
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
    // this.sprite.src=characterSprites.characterKick
    this.checkCollisions()
  }

  damage(){
    this.sprite.src=characterSprites.characterDamage
    this.posX-=5
  }

  checkCollisions(){
    enemiesArray.forEach( (enemy)=>{
      if(this.crashWith(enemy) && this.y>330){
        enemy.health-=5
        if(!parpadeaInterval){
          parpadeaInterval = setInterval(parpadea(enemy),1000/60)
          setTimeout(() => {
            clearInterval(parpadeaInterval)
            parpadeaInterval = null
          }, 1000);
        }
      } 
    })
  }
  crashWith(item){
    var crash = (this.posX < item.posX + 150) && 
                (this.posX + 120 > item.posX) 
    return crash;
  }
} //Termina clase Player
class Enemy{
  constructor(enemyID){
    //TODO: Diferentes Enemigos según ID
    this.health = 50
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
    this.spriteP = new Image()
    this.spriteP.src = this.imagesSource.walkLeftP
    this.isAtackking = false
  }

  draw(){ //dibuja al enemigo
    if(frames%10==0  ) this.changeSprite()   
    ctx.drawImage(this.sprite,this.x,this.y,this.width,this.height,this.posX,this.posY,150,this.inBoardHeight) 
  }

  changeSprite(){ //cambia el sprite
    if(this.health>0) this.moveToPlayer()
    else if(this.health<0){
      if(this.y>0 && this.health>-1000) this.y=0
        this.height= 320
        this.health=-10000
        this.sprite.src = golemSprites.die
    }
    this.y += this.height
    if(this.y>2300 && this.y<2600 && this.isAtackking) this.checkCollisions()
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
        this.spriteP.src = golemSprites.walkP
      } else if(this.posX>player1.posX){
        this.moveDirection = -1
        this.height = 320
        this.posY = 270
        this.inBoardHeight = 180
        this.sprite.src = golemSprites.walkLeft
        this.spriteP.src = golemSprites.walkLeftP
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
      this.spriteP.src = this.imagesSource.attackLeftP
      this.height = 480
      this.y =0
      this.isAtackking = true
      setTimeout(()=>{
        this.isAtackking = false
      },800)
    }else if(side === "Right"){
      this.sprite.src = this.imagesSource.attack
      this.spriteP.src = this.imagesSource.attackP
      this.height = 480
      this.y =0
      this.isAtackking = true
      setTimeout(()=>{
        this.isAtackking = false
      },800)
    }
  }

  checkCollisions(){
      if(this.crashWith(player1,"Right") && ( this.posX> player1.posX ) ){
        player1.health--
        if(!playerDamageInterval && player1.health>0){
          playerDamageInterval = setInterval(playerDamage,1000/60)
          setTimeout(() => {
            clearInterval(playerDamageInterval)
            playerDamageInterval = null
            player1.sprite.src= characterSprites.characterIdle
          }, 1200);
        }
      } 
  }
  
  crashWith(item,side){
    var crash;
    if(side=="Right") crash = ((this.posX> item.posX ) && (this.posX < item.posX+120)) //está a la derecha del player (semi-contención)
    if(side=="Left") crash = ((this.posX < item.posX) && (this.posX + 150 > item.posX))    //está a la izquierda del player (semi-contención)
    return crash;
  }
}//Termina clase Enemy
class HUD{
  constructor(player){
    this.health = 7
    this.x = 0
    this.y = 0
    this.width = 384
    this.height = 94
    this.posX = 25
    this.posY = 20
    this.inBoardHeight = 100
    this.inBoardWidth =300
    this.sprite = new Image()
    this.sprite.src = imagesHUD.p17
  }

  draw(){ //dibuja al jugador
    if(frames%10==0) this.changeSprite()   
    ctx.drawImage(this.sprite,this.x,this.y,this.width,this.height,this.posX,this.posY,this.inBoardWidth,this.inBoardHeight) 
  }

  changeSprite(){ //cambia el sprite
    
    if(this.health==6){this.sprite.src = imagesHUD.p16}
    else if(this.health==5){this.sprite.src = imagesHUD.p15}
    else if(this.health==4){this.sprite.src = imagesHUD.p14}
    else if(this.health==3){this.sprite.src = imagesHUD.p13}
    else if(this.health==2){this.sprite.src = imagesHUD.p12}
    else if(this.health==1){this.sprite.src = imagesHUD.p11}
    else if(this.health==0){this.sprite.src = imagesHUD.p10}
    
    this.y += this.height
    if(this.y>=this.sprite.naturalHeight) {
      this.y =0
    }
  }

}

//------------------------------------------------------------------//
//Instacias
let startScr= new StartScreen()
let board = new Board()
let player1 = new Player(1)
let player2 = new Player(2)
let hud1 = new HUD(player1)
let hud2 = new HUD(player2)


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
    if(!attackInterval) player1.sprite.src = characterSprites.characterIdle
    if(!attackInterval2) player2.sprite.src = characterSprites.characterIdle
  })
//-------AQUI TERMINAN LOS OBSERVADORES PARA HACER QUE PRESIONE VARIAS TECLAS ------ //
}
function update(){
  ctx.clearRect(0,0,canvas.width,canvas.height) //Borra todo el canvas
  board.draw()
  hud1.health = player1.health
  hud1.draw()
  if(frames%500==0) createEnemies(1)
  enemiesArray.forEach(function(enemy){
    if(enemy.posX<-120){
      enemiesArray.shift()
      return
    }
    enemy.draw()
  })
  //controles player1
  if(!playerDamageInterval){
  if (board.keys && board.keys[68] && isPlaying) {
    if(player1.posX>720 && !attackInterval){
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
    if(player1.posY>290) player1.moveUp()
   }
  if (board.keys && board.keys[83] && isPlaying) {
    if(player1.posY<320) player1.moveDown()
   }
  if(board.keys && player1.posY<280&& board.keys[69] && isPlaying){
    player1.sprite.src = characterSprites.characterJumpKick
    if(player1.y>400)  player1.checkCollisions()
  }
  }
  //controles player2
  if(!playerDamageInterval2){
    if (board.keys && board.keys[76] && isPlaying) {
      if(player2.posX>720 && !attackInterval){
        board.moveBG()
        player1.posX-=5 
        
        if(!jumpInterval2) player2.sprite.src = characterSprites.characterRun
        //return
      }else {
        player2.moveRigth()
      }
    }
    if (board.keys && board.keys[74] && isPlaying) {
      if(player2.posX<50) {
        player2.sprite.src = characterSprites.characterIdle
        //return
      }else {
        player2.moveLeft()
      }
    }
    if (board.keys && board.keys[73] && isPlaying) {
      if(player2.posY>290) player2.moveUp()
     }
    if (board.keys && board.keys[75] && isPlaying) {
      if(player2.posY<320) player2.moveDown()
     }
    if(board.keys && player2.posY<280&& board.keys[85] && isPlaying){
      player2.sprite.src = characterSprites.characterJumpKick
      if(player2.y>400)  player2.checkCollisions()
    }
}
  player1.draw()
  if(player2.active===true) player2.draw()
  if(!player2.active)  joinPlayer2Animation()
  frames++
}
function gameOver(){
  clearInterval(interval)
}
//------------------------------------------------------------------//
//Funciones auxiliares
function joinPlayer2Animation(){
  ctx.font = "20px VT323"
  ctx.fillText("Press 'u' to Join the legend",300,20)
}
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
function jumpPlayer2(){
  player2.jump()
}
function thePlayerAttack(){
   player1.attack()
}
function thePlayerAttack2(){
  player2.attack()
}
function createEnemies(id){
  enemiesArray.push(new Enemy(id))
}
function parpadea(personaje){
  let imagen = personaje.sprite.src
  if(personaje.health>0){setTimeout(()=>{
    personaje.sprite.src = personaje.spriteP.src
  },10)}

  if(personaje.health>0) {setTimeout(()=>{
    personaje.sprite.src = imagen
  },500)}
}
function playerDamage(){
  player1.damage()
}
function gameOverAnimation(){

}


//------------------------------------------------------------------//
//Los observadores (listeners)
addEventListener("keydown",function(e){
  //--------------PLAYER1----------------//
  if(e.key == "Enter"){
    start()
    board.music.play()
    isPlaying = true
}//Comenzar
if(isPlaying){
  if(jumpInterval) return
  if(e.keyCode==67){
    jumpInterval = setInterval(jumpPlayer,1000/60)
    setTimeout(function(){
      clearInterval(jumpInterval)
      jumpInterval = null
      player1.jumpDirection =1
      player1.sprite.src = characterSprites.characterIdle
    },1000)
  } //hace saltar al jugador
    if(e.keyCode == 69){
      if(attackInterval) return
        attackInterval = setInterval(thePlayerAttack(),1000/60)
        setTimeout(function(){
          clearInterval(attackInterval)
          attackInterval = null
          player1.sprite.src = characterSprites.characterIdle
        },1000)
  } //el jugador golpea

  if(jumpInterval2) return
  if(e.keyCode==77){
    jumpInterval = setInterval(jumpPlayer2,1000/60)
    setTimeout(function(){
      clearInterval(jumpInterval2)
      jumpInterval2 = null
      player2.jumpDirection =1
      player2.sprite.src = characterSprites.characterIdle
    },1000)
  } //hace saltar al jugador
    if(e.keyCode == 85){
      if(attackInterval2) return
        attackInterval2 = setInterval(thePlayerAttack2,1000/60)
        setTimeout(function(){
          clearInterval(attackInterval2)
          attackInterval2 = null
          player2.sprite.src = characterSprites.characterIdle
        },1000)
      player2.active=true
  } //el jugador golpea

}
})

addEventListener("load",function(){ //Coloca la pantalla de inicio
  startScr.drawStartScreen()
  loadScreenAnimation()
})
canvas.addEventListener("click",function(e){ //Click para el sonido de la pantalla de inicio
  let xClick = e.pageX -rect.left
  let yClick = e.pageY -rect.top
  if(xClick>950 && xClick<1000 && yClick>20 && yClick<70){ //Colocando coordenadas del ícono de sonido 
  if (startScr.audioIcon.src[startScr.audioIcon.src.length-5] == "e") { //¿Está en mute?
    startScr.audioIcon.src = iconImages.sound //cambiar ícono
    startScr.music.currentTime = 2
    startScr.music.play() 
  }else  if (startScr.audioIcon.src[startScr.audioIcon.src.length-5] == "d") { //¿Está en sound?
    startScr.music.pause()
    startScr.audioIcon.src = iconImages.mute //cambiar ícono
  }
}
})