let video = document.getElementById("video");
let stream = null;
let board = document.getElementById("board");
let overlay = document.getElementById("overlayMessage");

let tiles = [];
let emptyIndex = 8;
let imageSrc = "";

let timeLeft = 100;
let interval = null;

/* PANTALLAS */
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
  }
}

/* FOTO */
function takePhoto(){
  let canvas=document.createElement("canvas");
  canvas.width=video.videoWidth;
  canvas.height=video.videoHeight;

  let ctx=canvas.getContext("2d");
  ctx.drawImage(video,0,0);

  imageSrc=canvas.toDataURL();

  stopCamera();
  initGame();
}

/* INICIO */
function initGame(){
  tiles=[0,1,2,3,4,5,6,7,8];
  emptyIndex=8;
  overlay.innerText="";
  overlay.className="";

  shuffle();
  render();

  show("gameScreen");
  startTimer();
}

/* MEZCLA */
function shuffle(){
  for(let i=0;i<100;i++){
    let r=Math.floor(Math.random()*9);
    move(r,false);
  }
}

/* RENDER */
function render(){
  board.innerHTML="";

  tiles.forEach((num,i)=>{
    let div=document.createElement("div");

    if(num!==8){
      div.className="tile";

      let x=num%3;
      let y=Math.floor(num/3);

      div.style.backgroundImage=`url(${imageSrc})`;
      div.style.backgroundPosition=`${x*50}% ${y*50}%`;

      div.onclick=()=>move(i);
      div.ontouchstart=()=>move(i);
    }

    board.appendChild(div);
  });
}

/* MOVER + VIBRACIÓN */
function move(i,check=true){
  let r=Math.floor(i/3), c=i%3;
  let er=Math.floor(emptyIndex/3), ec=emptyIndex%3;

  let valid =
    (r===er && Math.abs(c-ec)===1) ||
    (c===ec && Math.abs(r-er)===1);

  if(valid){
    [tiles[i],tiles[emptyIndex]]=[tiles[emptyIndex],tiles[i]];
    emptyIndex=i;

    // 📳 VIBRACIÓN
    if(navigator.vibrate){
      navigator.vibrate(40);
    }

    render();
    if(check) checkWin();
  }
}

/* GANAR */
function checkWin(){
  let ok=[0,1,2,3,4,5,6,7,8];
  if(tiles.every((v,i)=>v===ok[i])){
    clearInterval(interval);
    overlay.innerText="GANASTE 🎉";
    overlay.className="win";
  }
}

/* TIMER */
function startTimer(){
  clearInterval(interval);
  timeLeft=100;

  interval=setInterval(()=>{
    timeLeft--;

    let t=document.getElementById("timer");
    let m=Math.floor(timeLeft/60);
    let s=timeLeft%60;

    t.innerText=`${m}:${s.toString().padStart(2,'0')}`;

    if(timeLeft<=12){
      t.classList.add("alert");
    }

    if(timeLeft<=0){
      clearInterval(interval);
      overlay.innerText="PERDISTE ❌";
      overlay.className="lose";
    }

  },1000);
}

/* BOTONES */
function restart(){ startCamera(); }
function resetGame(){ initGame(); }
