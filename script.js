let tiles = [];
let emptyIndex = 8;
let timeLeft = 100;
let interval;
let scores = JSON.parse(localStorage.getItem("scores")) || [];

/* INTRO */
window.onload = ()=>{
  setTimeout(()=>{
    document.getElementById("introAnimation").style.display="none";
    document.getElementById("homeScreen").classList.add("active");
  },2000);
};

/* INICIAR */
function initGame(){

  tiles = [0,1,2,3,4,5,6,7,8];
  emptyIndex = 8;

  shuffle();
  render();

  show("gameScreen");
  startTimer();
}

/* CAMBIO PANTALLA */
function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* MEZCLA */
function shuffle(){
  for(let i=0;i<100;i++){
    let r=Math.floor(Math.random()*9);
    move(r,false);
  }
}

/* DIBUJAR */
function render(){
  let board=document.getElementById("board");
  board.innerHTML="";

  tiles.forEach((num,i)=>{
    let div=document.createElement("div");

    if(num!==8){
      div.className="tile";
      div.innerText=num+1;
      div.onclick=()=>move(i);
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
      navigator.vibrate(30);
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

    let overlay=document.getElementById("overlayMessage");
    overlay.innerText="GANASTE";
    overlay.className="win";

    scores.push(timeLeft);
    localStorage.setItem("scores", JSON.stringify(scores));

    showRanking();
  }
}

/* TIMER */
function startTimer(){
  timeLeft=100;

  interval=setInterval(()=>{
    timeLeft--;

    let t=document.getElementById("timer");
    t.innerText=timeLeft+"s";

    if(timeLeft<=0){
      clearInterval(interval);
    }

  },1000);
}

/* RANKING */
function showRanking(){
  let div=document.getElementById("ranking");

  div.innerHTML = scores.map(s=>`<div class="time-box">${s}s</div>`).join("");
}
