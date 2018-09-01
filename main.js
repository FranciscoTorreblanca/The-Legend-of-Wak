//Configuración del Canvas
let canvas = document.getElementsByTagName("canvas")[0]
let ctx = canvas.getContext("2d")

//------------------------------------------------------------------//
//Test del canvas
//ctx.fillRect(0,0,canvas.width,canvas.height)

//------------------------------------------------------------------//
//Varibles globales  
let images = {
  background: "./backgrounds.png"
}

//------------------------------------------------------------------//
//Clases
class Board{
  constructor(){
    this.x =0
    this.y =0
    this.width = canvas.width
    this.height = canvas.height
    this.bg = new Image()
    this.bg.src = images.background
    this.bg.onload = ()=>{ this.draw() } //dibujar el board
    this.music = new Audio()
    this.music.src = "./music.mp3"
  }

  draw(){
    ctx.drawImage(this.bg,this.x,this.y,this.width,this.height,50,50,200,200)
  }
} //Aqui termina la clase Board


//------------------------------------------------------------------//
//Instacias
let board = new Board();

//------------------------------------------------------------------//
//Funciones principales
function start(){
  board.draw()
  board.music.play()
}

//------------------------------------------------------------------//
//Funciones auxiliares

//------------------------------------------------------------------//
//Los observadores (listeners)
start()
