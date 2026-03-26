let video = document.getElementById("video");
let stream = null;
let board = document.getElementById("board");
let overlay = document.getElementById("overlayMessage");

let tiles = [];
let emptyIndex = 8;
let imageSrc = "";

let timeLeft = 100;
let interval = null;

/* CAMBIO DE PANTALLA */
function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* CAMARA */
async function startCamera(){
  show("cameraScreen");
  stream = await navigator.mediaDevices.getUserMedia({video:true});
  video.srcObject = stream;
}

function stopCamera(){
  if(stream){
    stream.getTracks().forEach(t=>t.stop());
    stream = null;
  }
}

/* FOTO */
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

/* INICIAR JUEGO */
function initGame(){
  tiles = [0,1,2,3,4,5,6,7,8];
  emptyIndex = 8;
  overlay.innerText = "";
  overlay.className = "";

  shuffle();
  render();

  show("gameScreen");
  startTimer();
}

/* MEZCLAR */
function shuffle(){
  for(let i=0;i<120;i++){
    let rand = Math.floor(Math.random()*9);
    move(rand, false);
  }
}

/* RENDER (OPTIMIZADO PARA CELULAR) */
function render(){
  board.innerHTML="";

  tiles.forEach((num,index)=>{
    let div = document.createElement("div");

    if(num !== 8){
      div.className="tile";

      let x = num % 3;
      let y = Math.floor(num / 3);

      div.style.backgroundImage = `url(${imageSrc})`;
      div.style.backgroundSize = "300% 300%";
      div.style.backgroundPosition = `${x * 50}% ${y * 50}%`;

      // 👇 MEJOR RESPUESTA TÁCTIL (CELULAR)
      div.addEventListener("click", ()=>move(index));
      div.addEventListener("touchstart", ()=>move(index), {passive:true});
    }

    board.appendChild(div);
  });
}

/* MOVER PIEZA */
function move(index, check=true){
  let row = Math.floor(index / 3);
  let col = index % 3;

  let er = Math.floor(emptyIndex / 3);
  let ec = emptyIndex % 3;

  let valid =
    (row === er && Math.abs(col - ec) === 1) ||
    (col === ec && Math.abs(row - er) === 1);

  if(valid){
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
    emptyIndex = index;
    render();

    if(check) checkWin();
  }
}

/* VERIFICAR GANADOR */
function checkWin(){
  let correct = [0,1,2,3,4,5,6,7,8];

  if(tiles.every((v,i)=>v===correct[i])){
    clearInterval(interval);

    overlay.innerText = "GANASTE 🎉";
    overlay.className = "win";
  }
}

/* TIMER */
function startTimer(){
  clearInterval(interval);
  timeLeft = 100;

  interval = setInterval(()=>{
    timeLeft--;

    let min = Math.floor(timeLeft/60);
    let sec = timeLeft%60;

    document.getElementById("timer").innerText =
      `${min}:${sec.toString().padStart(2,'0')}`;

    if(timeLeft<=0){
      clearInterval(interval);

      overlay.innerText = "PERDISTE ❌";
      overlay.className = "lose";
    }

  },1000);
}

/* BOTONES */
function restart(){
  startCamera();
}

function resetGame(){
  initGame();
  }
