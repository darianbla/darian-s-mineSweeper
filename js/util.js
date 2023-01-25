//check neg
function setMinesNegsCount(cellI, cellJ, mat) {
  var mineCount = 0;
  // looping through 8 cells of specified cell
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    // wont count beyond border(undefined)
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      //wont count chosen cell
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= mat[i].length) continue;

      if (mat[i][j].isMine) mineCount++;
    }
  }
  return mineCount;
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
      // for (var k = 0; k < mines.length; k++) {
      //   var currMine = mines[k];

      //   if (!rows[j].isMine) {
      //     rows[j].isMine = implantMines(currMine, i, j);
      //   }
      // }

      //static way to implant mines
      if ((i === 1 && j === 1) || (i === 2 && j === 2)) {
        rows[j].isMine = true;
      }
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
      if (currCell.isMine) {
        currCell = MINE;
      }
    }
  }
  return board;
}

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

      var cellClass = `cell cell-${i}-${j}`;

      strHTML += `\t<td class="cell ${cellClass}" onclick="onCellClicked(this,${i},${j})"`;
      strHTML += "\t</td>\n";
    }
    strHTML += "</tr>\n";
  }
  elBoard.innerHTML = strHTML;
}

function onCellClicked(cell, i, j) {
  var currCell = gBoard[i][j];
  if (!currCell.isShown) {
    if (currCell.isMine) cell.innerText += MINE;
    else if (currCell.minesAroundCount !== 0)
      cell.innerText += `${currCell.minesAroundCount}`;
    currCell.isShown = true;
  }
}

function renderCell(location, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
  return elCell;
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
