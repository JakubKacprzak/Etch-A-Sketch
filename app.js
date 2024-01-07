let DEFAULT_BOARD_COLOR = "#ffffff";
let DEFAULT_TOOL_COLOR = "#000000";
let DEFAULT_BOARD_SIZE = 16;

const board = document.querySelector('.board');
const colorPick = document.querySelector('input[data-tool=color]');
const boardGrid = document.querySelector('#board-grid');
const clear = document.getElementById('clear-all');
const saveButton = document.getElementById("save");

let boardElements = document.querySelectorAll('.board-element');

let currentColor = colorPick.value;
let boardColor = DEFAULT_BOARD_COLOR;
let boardSize = DEFAULT_BOARD_SIZE;

document.addEventListener('DOMContentLoaded', () => {
  createBoard();

  boardGrid.addEventListener('input', createBoard);
  clear.addEventListener('click', clearBoard);
  colorPick.addEventListener('input', chooseColor);
  saveButton.addEventListener('click', saveBoardAsImage)

  boardGrid.value = boardSize;


  function createBoard(){
    board.innerHTML = "";

    boardSize = boardGrid.value;
    
    let fragment = document.createDocumentFragment();

    for(let i = 0; i < boardSize * boardSize; i++){
      let boardElement = document.createElement("div");
      
      boardElement.setAttribute("class", "board-element");
      boardElement.setAttribute("style", `background-color: ${boardColor};`)

      boardElement.addEventListener("mouseenter", toolEvent);
      boardElement.addEventListener("mousedown", toolEvent);

      fragment.appendChild(boardElement);
    }
    board.appendChild(fragment);

    board.style.cssText = `grid-template-rows: repeat(${boardSize}, 1fr);grid-template-columns: repeat(${boardSize}, 1fr);`;
    boardElements = document.querySelectorAll('.board-element');
  }

  function clearBoard(){
    board.innerHTML = "";

    currentColor = DEFAULT_TOOL_COLOR;
    boardColor = DEFAULT_BOARD_COLOR;
    boardSize = DEFAULT_BOARD_SIZE;

    colorPick.value = currentColor;
    boardGrid.value = boardSize;

    createBoard();
  }

  function saveBoardAsImage() {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${board.offsetWidth}" height="${board.offsetHeight}">${board.innerHTML}</svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'board_image.svg';
    link.click();
    URL.revokeObjectURL(link.href);
  }
  

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
  const paintPourTool = document.querySelector('input[data-tool=paint-pour]');

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
    if(paintPourTool.checked){
      paintPour(event);
    }
  }

  function paintPour(e) {
    if (e.type !== "mousedown") return;

    const clickedElement = e.target;

    if (!board.contains(clickedElement)) {
      return;
    }

    const clickedColor = clickedElement.style.backgroundColor;
    const index = Array.from(boardElements).indexOf(clickedElement);

    floodFill(index, clickedColor);
  }


  function floodFill(index, targetColor) {
    const stack = [index];
    const visited = new Set();

    while (stack.length > 0) {
      const currentIndex = stack.pop();
      const currentElement = boardElements[currentIndex];

      if (visited.has(currentIndex)) continue;

      visited.add(currentIndex);

      if (currentElement.style.backgroundColor === targetColor) {
        currentElement.style.backgroundColor = currentColor;

        const top = currentIndex - boardSize;
        const bottom = currentIndex + boardSize;
        const left = currentIndex % boardSize !== 0 ? currentIndex - 1 : null;
        const right = (currentIndex + 1) % boardSize !== 0 ? currentIndex + 1 : null;

        if (top >= 0) stack.push(top);
        if (bottom < boardSize * boardSize) stack.push(bottom);
        if (left !== null) stack.push(left);
        if (right !== null) stack.push(right);
      }
    }
  }


  function getDropperColor(e){
    if(e.type != "mousedown") return;

    currentColor = e.target.style.backgroundColor;
    let temp = currentColor.length
    let [r, g, b] = currentColor.substring(4, temp - 1).split(",");

    colorPick.value = rgbToHex([r.trim(), g.trim(), b.trim()]);

    dropperTool.checked = false;
    penTool.checked = true;

  }

  function componentToHex(component) {
    component = parseInt(component)
    let hex = component.toString(16);
    return hex.length == 1 ? '0' + hex : hex
  }

  function rgbToHex([r, g, b]){
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  function changeToRandomColor(e){
    if(!mouseDown && e.type != "mousedown") return;

    e.target.style.cssText = `background-color: ${getRandomColor()};`;
  }

  function eraseElement(e){
    if(!mouseDown && e.type != "mousedown") return;

    e.target.style.backgroundColor = boardColor;
  }

  function changeColor(e){
    if(!mouseDown && e.type != "mousedown") return;

    e.target.style.backgroundColor = currentColor;
  }

  function chooseColor(){
    currentColor = colorPick.value;
  }
});