"use strict";

//check neg
function setMinesNegsCount(cellI, cellJ, board) {
  var mineCount = 0;
  // looping through 8 cells of specified cell
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    // wont count beyond border(undefined)
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      //wont count chosen cell
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= board[i].length) continue;

      if (board[i][j].isMine) mineCount++;
    }
  }
  return mineCount;
}
//check neg for recursion
function setEmptyNegsCount(cellI, cellJ, board) {
  var elClickedCell = document.querySelector(`.cell-${cellI}-${cellJ}`);
  var clickedCell = board[cellI][cellJ];
  // looping through 8 cells of specified cell
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    // wont count beyond border(undefined)
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      //wont count chosen cell
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= board[i].length) continue;
      var currCell = board[i][j];
      var elCell = document.querySelector(`.cell-${i}-${j}`);

      if (!currCell.isShown && !currCell.isMine) {
        if (currCell.minesAroundCount !== 0) {
          currCell.isShown = true;
          elCell.classList.add("shown");
          // console.log("num click!");
          onCellClicked(elCell, i, j);
        }

        if (currCell.minesAroundCount === 0) {
          elCell.classList.add("shown");
          onCellClicked(elCell, i, j);
        }
      }
    }
  }
}

function buildBoard(size, minesnum) {
  var mines = getMineLocation(size, minesnum);

  var board = [];
  for (var i = 0; i < size; i++) {
    var rows = [];

    for (var j = 0; j < size; j++) {
      rows[j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        location: {
          i: i,
          j: j,
        },
      };
      //random way to implant mines
      for (var k = 0; k < mines.length; k++) {
        var currMine = mines[k];

        if (!rows[j].isMine) {
          rows[j].isMine = implantMines(currMine, i, j);
        }
      }

      //static way to implant mines
      // if ((i === 1 && j === 1) || (i === 2 && j === 2)) {
      //   rows[j].isMine = true;
      // }
    }
    board.push(rows);
  }
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      var currCell = board[i][j];
      currCell.minesAroundCount = setMinesNegsCount(
        currCell.location.i,
        currCell.location.j,
        board
      );
    }
  }
  return board;
  // return implantNums(board);
}

// function implantNums(board) {
//   var size = gLevel.size;

//       // renderCell(
//       //   currCell.location.i,
//       //   currCell.location.j,
//       //   currCell.minesAroundCount
//       // );
//     }

function implantMines(mines, i, j) {
  var res = false;
  if (mines !== undefined) {
    res = i === mines.i && j === mines.j;
    return res;
  }
  return res;
}

function getMineLocation(size, maxMines) {
  var positions = [];
  for (var i = 0; i < maxMines; i++) {
    var pos = {
      i: getRandomInt(0, size - 1),
      j: getRandomInt(0, size - 1),
    };
    // console.log("pos:", pos);
    positions.push(pos);
    // console.log("pos befor splice", positions);
    removeDuplicates(positions);
    // console.log("pos affter splice", positions);
  }
  return positions;
}

function renderBoard(board) {
  var elBoard = document.querySelector(".board");
  var strHTML = "";

  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>\n";

    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      var cellClass = `cell-${i}-${j}`;
      var elCell = document.querySelector(`cell-${i}-${j}`);
      if (currCell.isMine) cellClass += " mine";
      if (!currCell.isMine && currCell.minesAroundCount !== 0)
        cellClass += " num";
      if (!currCell.isMine && currCell.minesAroundCount === 0)
        cellClass += " empty";
      if (currCell.isShown) cellClass += " shown";
      strHTML += `\t<td class="cell ${cellClass}" onclick="onCellClicked(this,${i},${j})"`;
      strHTML += "\t</td>\n";
    }
    strHTML += "</tr>\n";
  }
  elBoard.innerHTML = strHTML;
}

function onCellClicked(cell, i, j) {
  var currCell = gBoard[i][j];
  var elAllMines = document.querySelectorAll(".mine");
  // console.log("currCell:", currCell);
  // console.log("mines:", elAllMines);
  if (!currCell.isMarked) {
    if (!currCell.isShown && currCell.isMine) {
      if (gIsFirstClick) {
        gIsFirstClick = false;

        cell.classList.remove("mine");
        cell.classList.remove("num");
        cell.classList.remove("empty");
        gBoard = buildBoard(gLevel.size, gLevel.mines);
        currCell = gBoard[i][j];
        currCell.isShown = true;
        renderBoard(gBoard);
        reverseRenderCell(gBoard);
        console.log(currCell.minesAroundCount);
        onCellClicked(cell, i, j);
      } else
        for (var elMine of elAllMines) {
          // console.log("elmine:", elMine);
          elMine.innerText = MINE;
          currCell.isShown = true;
          elMine.classList.add("shown");
          gameOver();
        }
    }
    if (!currCell.isMine) {
      if (currCell.minesAroundCount !== 0) {
        cell.classList.add("shown");
        currCell.isShown = true;
        // console.log(currCell);
      }
      if (currCell.minesAroundCount === 0) {
        currCell.isShown = true;
        cell.classList.add("shown");
        setEmptyNegsCount(i, j, gBoard);
      }
    }
  }
  gIsFirstClick = false;
  reverseRenderCell(gBoard);

  if (!gIsFirstClick) {
    checkIsVictory();
  }
}

// cant find a place to warp this as a function...
window.oncontextmenu = (e) => {
  e.preventDefault();
  var countAction = 1;
  var elCell = document.querySelector(".cell:hover");
  if (!gIsFirstClick) {
    if (elCell.innerText === FLAG && countAction > 0) {
      elCell.innerText = "";
      elCell.classList.remove("marked");
      gFlagsLeft++;
      hundleFlagsLeft();
      countAction = 0;
    }
    if (elCell.innerText === "" && countAction > 0 && gFlagsLeft > 0) {
      elCell.innerText = FLAG;
      elCell.classList.add("marked");
      gFlagsLeft--;
      hundleFlagsLeft();
      countAction = 0;
    }
  }

  reverseRenderCell(gBoard);
  checkIsVictory();
};

//NOT DOING ANYTHING
function hundleRightClick(cell, i, j) {
  //   document.oncontextmenu = rightClick;
  //   function rightClick(e) {
  //     e.preventDefault();
  //     // var currCell = gBoard[i][j];
  //     // if (!currCell.isShown) {
  //     //   if (!currCell.isMarked) {
  //     //     cell.innerText = FLAG;
  //     //     currCell.isMarked = true;
  //     //   } else {
  //     //     cell.innerText -= FLAG;
  //     //     currCell.isMarked = false;
  //     //   }
  //     // }
  //     if (document.getElementById("contextMenu").style.display == "block")
  //       hideMenu();
  //   }
}

function reverseRenderCell(board) {
  var locationI;
  var locationJ;
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      var currCell = board[i][j];
      locationI = currCell.location.i;
      locationJ = currCell.location.j;
      var elCell = document.querySelector(`.cell-${locationI}-${locationJ}`);
      //check marked
      if (elCell.classList.contains("marked")) {
        currCell.isMarked = true;
        // console.log("currCell:", currCell);
      } else {
        currCell.isMarked = false;
      }
      //check num
      if (currCell.minesAroundCount !== 0 && !currCell.isMine) {
        elCell.classList.remove("empty");
        elCell.classList.add("num");
        if (currCell.isShown) elCell.innerText = `${currCell.minesAroundCount}`;
      }
      //check empty
      if (currCell.minesAroundCount === 0 && !currCell.isMine) {
        elCell.classList.add("empty");
      }
    }
  }
}

function renderCell(i, j, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${i}-${j}`);
  elCell.innerText = `${value}`;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function removeDuplicates(nums) {
  var noDuplicateNums = [];
  for (var i = 0; i < nums.length; i++) {
    var currNum = nums[i];

    if (!noDuplicateNums.includes(currNum)) {
      noDuplicateNums.push(currNum);
    }
  }
  return nums;
}

function checkIsVictory() {
  var elAllMines = document.querySelectorAll(".mine");
  var elAllNums = document.querySelectorAll(".num");
  var elAllEmpty = document.querySelectorAll(".empty");

  //lose condition
  // console.log("elAllMines:", elAllMines);
  for (var i = 0; i < elAllMines.length; i++) {
    if (elAllMines[i].classList.contains("shown"))
      return gameOver(gGame.isVictory);
  }
  // win conidition
  // if all mines are marked return true and all other cells are showen
  for (var i = 0; i < elAllMines.length; i++) {
    if (!elAllMines[i].classList.contains("marked")) return;
  }
  var numsCellsShown = [];
  for (var i = 0; i < elAllNums.length; i++) {
    if (!elAllNums[i].classList.contains("shown")) return;
    if (elAllNums[i].classList.contains("shown"))
      numsCellsShown.push(elAllNums[i]);
  }
  var emptyCellsShonw = [];
  for (var i = 0; i < elAllEmpty.length; i++) {
    if (!elAllEmpty[i].classList.contains("shown")) return;
    if (elAllEmpty[i].classList.contains("shown"))
      emptyCellsShonw.push(elAllEmpty[i]);
  }
  console.log(
    "numsCellsShown=elAllNums?",
    numsCellsShown.length,
    elAllNums.length
  );
  if (
    numsCellsShown.length === elAllNums.length &&
    emptyCellsShonw.length === elAllEmpty.length
  ) {
    gGame.isVictory = true;
    return gameOver(gGame.isVictory);
  }
}

function gameOver() {
  var elModal = document.querySelector(".modal");
  var elModalMsg = document.querySelector(".user-msg");
  var msg = "";
  if (gGame.isVictory) {
    startButton.innerText = HAPPY;
    msg = "You win!";
    elModalMsg.innerText = msg;
    elModalMsg.style.color = "rgb(29, 220, 137)";
  } else {
    startButton.innerText = SAD;
    msg = "GAME-OVER";
    elModalMsg.innerText = msg;
  }
  elModal.style.display = "block";
  console.log("gameover");
}
