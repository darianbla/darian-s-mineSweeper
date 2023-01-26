"use strict";
const MINE = "💣";
const FLAG = "🚩";
const NORMAL = "😄";
const HAPPY = "😎";
const SAD = "🤯";
var gIsFirstClick = false;
var startButton = document.querySelector(".start-over");
var difficulty = "Easy";
var gLevel = {
  mines: 2,
  size: 4,
};
const gGame = {
  isVictory: false,
  isGameOn: false,
  flagedMines: 0,
  secondsPassed: 0,
};
var gBoard;

//runs the game
function initGame() {
  gIsFirstClick = false;
  startButton.innerText = NORMAL;
  switch (difficulty) {
    case "Easy":
      gLevel.mines = 2;
      gLevel.size = 4;
      break;
    case "Medium":
      gLevel.mines = 14;
      gLevel.size = 8;
      break;
    case "Expert":
      gLevel.mines = 32;
      gLevel.size = 12;
      break;
  }
  gGame.isGameOn = true;
  gGame.isVictory = false;
  gGame.flagedMines = 0;
  gBoard = buildBoard(gLevel.size, gLevel.mines);
  renderBoard(gBoard);
  console.table(gBoard);

  var elModal = document.querySelector(".modal");
  elModal.style.display = "none";
}

function changeDifficulty(str) {
  difficulty = str;
  console.log(difficulty);
  initGame();
}
