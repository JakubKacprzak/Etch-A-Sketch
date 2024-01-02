const board = document.querySelector('.board');

let DEFAULT_COLOR = "#000000";
let DEFAULT_BOARD_COLOR = "#ffffff";
let DEFAULT_BOARD_SIZE = 16;

let currentColor = DEFAULT_COLOR;
let boardColor = DEFAULT_BOARD_COLOR;
let boardSize = DEFAULT_BOARD_SIZE;


function createBoard(boardSize){
  let fragment = document.createDocumentFragment();

  for(let i = 0; i < boardSize * boardSize; i++){
    let boardElement = document.createElement("div");
    
    boardElement.setAttribute("class", "board-element");

    boardElement.addEventListener("mouseenter", toolEvent);
    boardElement.addEventListener("mousedown", toolEvent);

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

  return "#" + randomHex;
}

let mouseDown = false;

document.body.onmousedown = () => mouseDown = true;
document.body.onmouseup = () => mouseDown = false;

const penTool = document.querySelector('input[data-tool=pen]');
const eraserTool = document.querySelector('input[data-tool=eraser]');
const randomColorTool = document.querySelector('input[data-tool=rand-color]');
const dropperTool = document.querySelector('input[data-tool=dropper]');
const boardElements = document.querySelectorAll('.board-element')

function toolEvent(event) {
  if(penTool.checked){
    changeColor(event);
  };
  if(eraserTool.checked){
    eraseElement(event);
  }
  if(randomColorTool.checked){
    changeToRandomColor(event);
  }
  if(dropperTool.checked){
    getDropperColor(event);
  }
}

function getDropperColor(e){
  if(e.type != "mousedown") return;
  currentColor = e.target.style.backgroundColor
  dropperTool.checked = false;
  penTool.checked = true;

}

function changeToRandomColor(e){
  if(!mouseDown && e.type != "mousedown") return;

  e.target.style.backgroundColor = getRandomColor();
}

function eraseElement(e){
  if(!mouseDown && e.type != "mousedown") return;

  e.target.style.backgroundColor = boardColor;
}

function changeColor(e){
  if(!mouseDown && e.type != "mousedown") return;

  e.target.style.backgroundColor = currentColor;
}