"use strict";
const MINE = "💣";
var gBoard;

//runs the game
function initGame() {
  gBoard = buildBoard(4, 2);
  renderBoard(gBoard);
  console.table(gBoard);
}
