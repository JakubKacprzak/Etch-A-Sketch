const board = document.querySelector('.board');

let boardSize = 16;

function createBoard(boardSize){
  let fragment = document.createDocumentFragment();

  for(let i = 0; i < boardSize * boardSize; i++){
    let boardElement = document.createElement("div");
    
    boardElement.setAttribute("class", "board-element");
    
    fragment.appendChild(boardElement);
  }
  board.appendChild(fragment)
}
createBoard(boardSize);