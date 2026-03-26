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

// cámara
function startCamera(){
  show("cameraScreen");

  navigator.mediaDevices.getUserMedia({video:true})
    .then(stream => {
      video.srcObject = stream;
    });
}

function takePhoto(){
  let canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 300;
  let ctx = canvas.getContext("2d");

  ctx.drawImage(video,0,0,300,300);
  imageSrc = canvas.toDataURL();

  initGame();
}

// juego
function initGame(){
  tiles = [0,1,2,3,4,5,6,7,8];
  render();
  show("gameScreen");
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
      div.style.backgroundPosition=`-${x*100}px -${y*100}px`;
    }

    puzzle.appendChild(div);
  });
}
