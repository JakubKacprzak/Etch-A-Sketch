const board = document.querySelector('.board');

let boardSize = 16;

function createBoard(boardSize){
  let fragment = document.createDocumentFragment();

  for(let i = 0; i < boardSize * boardSize; i++){
    let boardElement = document.createElement("div");
    
    boardElement.setAttribute("class", "board-element");
    boardElement.addEventListener("mouseenter", changeColor);
    boardElement.addEventListener("mousedown", changeColor);
    
    fragment.appendChild(boardElement);
  }
  board.appendChild(fragment)
}

createBoard(boardSize);

function getRandomColor(){
  const hexPattern = ["A", "B", "C", "D", "E", "F"];

  let randomHex = '';
  let char;

  for(let i = 0; i < 6; i++){
    char = Math.floor(Math.random() * 15);
    char > 9 ? randomHex += hexPattern[char - 10] : randomHex += char;;
  }

  return "#1c1c1c"
  // return "#" + randomHex;
}

let mouseDown = false;

document.body.onmousedown = () => mouseDown = true;
document.body.onmouseup = () => mouseDown = false;

function changeColor(e){
  if(!mouseDown && e.type != "mousedown") return;
  this.style.backgroundColor = getRandomColor();
}