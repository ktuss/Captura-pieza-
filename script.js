let video = document.getElementById("video");
let stream = null;
let board = document.getElementById("board");
let overlay = document.getElementById("overlayMessage");

let tiles = [];
let emptyIndex = 8;
let imageSrc = "";

let timeLeft = 100;
let interval = null;
let difficulty = 1;

let history = JSON.parse(localStorage.getItem("history")) || [];

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
  showHistory();
}

/* MEZCLA */
function shuffle(){
  let moves = 80 + (difficulty * 40);
  for(let i=0;i<moves;i++){
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

      if(imageSrc){
        div.style.backgroundImage=`url(${imageSrc})`;
        div.style.backgroundPosition=`${x*50}% ${y*50}%`;
      }else{
        div.style.background="#111";
        div.innerText = num+1;
      }

      div.addEventListener("click", ()=>move(i));
      div.addEventListener("touchstart", (e)=>{
        e.preventDefault();
        move(i);
      });
    }

    board.appendChild(div);
  });
}

/* MOVER */
function move(i,check=true){
  let r=Math.floor(i/3), c=i%3;
  let er=Math.floor(emptyIndex/3), ec=emptyIndex%3;

  let valid =
    (r===er && Math.abs(c-ec)===1) ||
    (c===ec && Math.abs(r-er)===1);

  if(valid){
    [tiles[i],tiles[emptyIndex]]=[tiles[emptyIndex],tiles[i]];
    emptyIndex=i;

    if(navigator.vibrate){
      navigator.vibrate([20,10,20]);
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

    overlay.innerText="GANASTE";
    overlay.className="win";

    let now = new Date();
    let tiempo = 100 - timeLeft;

    history.push({
      fecha: now.toLocaleDateString(),
      tiempo: tiempo
    });

    history = history.slice(-10);
    localStorage.setItem("history", JSON.stringify(history));

    showHistory();
    difficulty++;
  }
}

/* HISTORIAL */
function showHistory(){
  let div = document.getElementById("historyTable");

  div.innerHTML = `
    <h3>HISTORIAL</h3>
    <table>
      <tr>
        <th>Fecha</th>
        <th>Segundos</th>
      </tr>
      ${history.map(h=>`
        <tr>
          <td>${h.fecha}</td>
          <td>${h.tiempo}</td>
        </tr>
      `).join("")}
    </table>
  `;
}

/* BORRAR */
function clearHistory(){
  history = [];
  localStorage.removeItem("history");
  showHistory();
}

/* TIMER */
function startTimer(){
  clearInterval(interval);
  timeLeft = 100 - (difficulty * 5);

  interval=setInterval(()=>{
    timeLeft--;

    let m=Math.floor(timeLeft/60);
    let s=timeLeft%60;

    let t=document.getElementById("timer");
    t.innerText=`${m}:${s.toString().padStart(2,'0')}`;

    if(timeLeft<=12){
      t.classList.add("alert");
    }

    if(timeLeft<=0){
      clearInterval(interval);
      overlay.innerText="PERDISTE";
      overlay.className="lose";
    }

  },1000);
}

/* BOTONES */
function restartCamera(){ startCamera(); }
function resetGame(){ initGame(); }

/* INTRO */
window.addEventListener("load", ()=>{
  setTimeout(()=>{
    let intro = document.getElementById("introAnimation");
    if(intro) intro.style.display="none";
  },2000);
});
