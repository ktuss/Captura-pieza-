 let video = document.getElementById("video");
let stream = null;

let board = document.getElementById("board");

let tiles = [];
let emptyIndex = 8;
let imageSrc = "";

let timer = 0;
let interval = null;

/* CAMBIO DE PANTALLA */
function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* INICIAR CAMARA */
async function startCamera(){
  show("cameraScreen");

  stream = await navigator.mediaDevices.getUserMedia({video:true});
  video.srcObject = stream;
}

/* TOMAR FOTO */
function takePhoto(){
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let ctx = canvas.getContext("2d");
  ctx.drawImage(video,0,0);

  imageSrc = canvas.toDataURL();

  stopCamera();
  initGame();
}

/* APAGAR CAMARA */
function stopCamera(){
  if(stream){
    stream.getTracks().forEach(track=>track.stop());
    stream = null;
  }
}

/* INICIAR JUEGO */
function initGame(){
  tiles = [0,1,2,3,4,5,6,7,8];
  emptyIndex = 8;

  shuffle();
  render();

  show("gameScreen");
  startTimer();
}

/* MEZCLAR */
function shuffle(){
  for(let i=0;i<100;i++){
    let rand = Math.floor(Math.random()*9);
    move(rand);
  }
}

/* DIBUJAR */
function render(){
  board.innerHTML="";

  tiles.forEach((num,index)=>{
    let div = document.createElement("div");

    if(num !== 8){
      div.className="tile";

      let x = num % 3;
      let y = Math.floor(num / 3);

      div.style.backgroundImage = `url(${imageSrc})`;
      div.style.backgroundPosition = `${x*50}% ${y*50}%`;

      div.onclick = ()=>move(index);
    }

    board.appendChild(div);
  });
}

/* MOVIMIENTO CORRECTO 🔥 */
function move(index){
  let row = Math.floor(index / 3);
  let col = index % 3;

  let emptyRow = Math.floor(emptyIndex / 3);
  let emptyCol = emptyIndex % 3;

  let isValid =
    (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
    (col === emptyCol && Math.abs(row - emptyRow) === 1);

  if(isValid){
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
    emptyIndex = index;
    render();
  }
}

/* TIMER */
function startTimer(){
  clearInterval(interval);
  timer = 0;

  interval = setInterval(()=>{
    timer++;

    let min = Math.floor(timer/60);
    let sec = timer%60;

    document.getElementById("timer").innerText =
      `Tiempo: ${min}:${sec.toString().padStart(2,'0')}`;
  },1000);
}

/* REINICIAR */
function restart(){
  show("cameraScreen");
  startCamera();
    }
