let video = document.getElementById("video");
let puzzle = document.getElementById("puzzle");

let tiles = [];
let emptyIndex = 8;
let imageSrc = "";

// navegación
function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function goHome(){
  stopCamera();
  show("home");
}

// cámara
let stream = null;

function startCamera(){
  show("cameraScreen");

  navigator.mediaDevices.getUserMedia({video:true})
    .then(s => {
      stream = s;
      video.srcObject = stream;
    });
}

function stopCamera(){
  if(stream){
    stream.getTracks().forEach(t=>t.stop());
    stream = null;
  }
  video.srcObject = null;
}

function takePhoto(){
  let canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 300;
  let ctx = canvas.getContext("2d");

  ctx.drawImage(video,0,0,300,300);
  imageSrc = canvas.toDataURL();

  stopCamera();
  initGame();
}

// juego
function initGame(){
  tiles = [0,1,2,3,4,5,6,7,8];
  emptyIndex = 8;

  shuffle();
  render();

  show("gameScreen");
}

function shuffle(){
  for(let i=0;i<50;i++){
    let moves = [];

    if(emptyIndex%3!==0) moves.push(emptyIndex-1);
    if(emptyIndex%3!==2) moves.push(emptyIndex+1);
    if(emptyIndex>2) moves.push(emptyIndex-3);
    if(emptyIndex<6) moves.push(emptyIndex+3);

    let rand = moves[Math.floor(Math.random()*moves.length)];

    [tiles[rand],tiles[emptyIndex]]=[tiles[emptyIndex],tiles[rand]];
    emptyIndex = rand;
  }
}

function render(){
  puzzle.innerHTML="";

  tiles.forEach((val,i)=>{
    let div=document.createElement("div");
    div.className="tile";

    if(val===8){
      div.classList.add("empty");
    } else {
      let x=val%3;
      let y=Math.floor(val/3);

      div.style.backgroundImage=`url(${imageSrc})`;
      div.style.backgroundPosition=`${x*50}% ${y*50}%`;
    }

    div.onclick=()=>move(i);

    puzzle.appendChild(div);
  });
}

function canMove(i){
  let r=Math.floor(i/3), c=i%3;
  let er=Math.floor(emptyIndex/3), ec=emptyIndex%3;

  return (r===er && Math.abs(c-ec)===1) ||
         (c===ec && Math.abs(r-er)===1);
}

function move(i){
  if(!canMove(i)) return;

  [tiles[i],tiles[emptyIndex]]=[tiles[emptyIndex],tiles[i]];
  emptyIndex=i;

  render();
}

// botones
function nuevaFoto(){
  stopCamera();
  startCamera();
}

function reiniciar(){
  initGame();
    }
