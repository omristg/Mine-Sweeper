'use strict'

// DELETE LATER!!!
var gIsRevealed = false;
var gTimerIntervalId;

const NUM1 = '1️⃣';
const NUM2 = '2️⃣';
const NUM3 = '3️⃣';
const NUM4 = '4️⃣';

const MINE_IGM = '<img src="img/mine.png">';
const HEART = '🖤';

// const MINE = '💣';
var gBoard;

var gGame = {
    isOn: false,
    hasAnyCellClicked: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    hints: 3,
    isHintOn: false
}

var gLevel = {
    SIZE: 4,
    MINES: 2,
}

function init() {
    gBoard = createBoard(gLevel.SIZE);
    renderBoard(gBoard);
    // DELETE LATER!!!
    // console.log(gBoard);
    // console.table(gBoard);
    statusSmiley('normal');
    displayLife();
    displayHints()
}



function resetGame() {

    gGame.hasAnyCellClicked = false;
    gGame.isOn = false;
    gSeconds = gMinutes = 0;
    gGame.secsPassed = 0;
    gGame.lives = 3;
    gGame.hints = 3;
    clearInterval(gTimerIntervalId);
    document.querySelector('.timer').innerText = '00:00';
    document.querySelector('.score').style.display = 'none';
    init();
}

function setLevel(size) {
    gLevel.SIZE = size

    switch (gLevel.SIZE) {
        case 4:
            gLevel.MINES = 2;
            break;
        case 8:
            gLevel.MINES = 12;
            break;
        case 12:
            gLevel.MINES = 30;
            break;
    }
    resetGame();
}



function createBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                location: { i, j }
            }
            board[i][j] = cell;
        }
    }
    setRandomMines(board, gLevel.SIZE, gLevel.MINES)
    return board
}


function setRandomMines(board, size, minesNum) {
    // console.log(minesNum);
    for (var i = 0; i < minesNum; i++) {

        var randI = getRandomInt(0, size);
        var randJ = getRandomInt(0, size);
        board[randI][randJ].isMine = true;
    }
}


function renderBoard(board) {

    SetMinesNegsCount(board);

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i, j })
            // LATERCHECK: to see if this is needed or not
            cellClass += (!currCell.isShown) ? ' hidden' : '';
            cellClass += (currCell.isMarked) ? ' marked' : '';

            strHTML += `<td class="cell ${cellClass}"
			 onclick="cellClicked(this, ${i},${j})" 
             oncontextmenu="cellMarked(this, ${i},${j})">`;

            //  TODO: make a top layer img and maybe do it in a better way
            if (!currCell.isShown) strHTML += '';
            else {

                if (currCell.isMine) strHTML += MINE_IGM;
                else if (currCell.minesAroundCount === 1) strHTML += NUM1;
                else if (currCell.minesAroundCount === 2) strHTML += NUM2;
                else if (currCell.minesAroundCount === 3) strHTML += NUM3;
                else if (currCell.minesAroundCount === 4) strHTML += NUM4;
            }

            strHTML += '</td>';
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


function firstMove(elCell, i, j) {
    // TODO: add the first cell setmine function
    gGame.isOn = true;
    gGame.hasAnyCellClicked = true;
    gTimerIntervalId = setInterval(timer, 1000);
}



function cellClicked(elCell, i, j) {

    if (gGame.hasAnyCellClicked && !gGame.isOn) return;
    if (!gGame.isOn) firstMove(elCell, i, j);

    var cell = gBoard[i][j]
    if (cell.isMarked) return;

    cell.isShown = true;
    if (gGame.isHintOn) {
        expandShown(gBoard, elCell, i, j)
        renderBoard(gBoard);
        fireHint(gBoard, i, j);
    }
    if (cell.isMine) return mineHit(elCell, i, j);
    // TODO: find a better constraction
    else if (!gGame.isHintOn) {
        expandShown(gBoard, elCell, i, j)
        renderBoard(gBoard);

        checkGameOver();
    }
}



function mineHit(elCell, cellI, cellJ) {
    gGame.lives--;
    displayLife();
    setTimeout(hideMineBack, 500, cellI, cellJ);
    if (gGame.lives) return;

    gGame.isOn = false;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine) currCell.isShown = true;
        }
    }
    // TODO: fix change in color 
    elCell.style.backgroundColor = 'red';
    renderBoard(gBoard);
    statusSmiley('loose');
    clearInterval(gTimerIntervalId);
}

function hideMineBack(i, j) {
    gBoard[i][j].isShown = false;
    if (gGame.isOn) renderBoard(gBoard);
}

function checkGameOver() {
    gGame.markedCount = 0;
    gGame.shownCount = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isShown) gGame.shownCount++;
            if (currCell.isMarked) gGame.markedCount++;
        }
    }
    var numToWin = (gLevel.SIZE ** 2) - gLevel.MINES;
    if (gGame.shownCount === numToWin &&
        gGame.markedCount === gLevel.MINES) {
        playerWins()
    }
}


function playerWins() {
    gGame.isOn = false;
    clearInterval(gTimerIntervalId);
    statusSmiley('win');
    var elScore = document.querySelector('.score');
    elScore.innerText = gGame.secsPassed;
    elScore.style.display = 'block';
    setTimeout(registerScore, 250);
}


function cellMarked(elCell, i, j) {
    var cell = gBoard[i][j];
    if (cell.isShown) return;
    cell.isMarked = (!cell.isMarked) ? true : false;
    elCell.classList.toggle('marked');
    if (!gGame.hasAnyCellClicked) firstMove();
    checkGameOver();
}


function expandShown(board, elCell, i, j) {
    var negsCount = board[i][j].minesAroundCount;
    if (!negsCount) showHideNegs(board, i, j, 'reveal')

}


function showHideNegs(board, rowIdx, colIdx, action) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue

            var currCell = board[i][j];
            if (currCell.isMarked) continue;
            if (action === 'reveal') {
                if (!currCell.isShown) currCell.isShown = true;
            } else if (currCell.isShown) {
                currCell.isShown = false;
                board[rowIdx][colIdx].isShown = false;
            }
        }
    }
}


function SetMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j].minesAroundCount = countNegMines(board, i, j)
        }
    }
}


function countNegMines(board, rowIdx, colIdx) {

    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            if (board[i][j].isMine) count++;
        }
    }
    return count
}


// DELETE LATER!!!
function revealBoard() {
    var input = (!gIsRevealed) ? true : false;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            gBoard[i][j].isShown = input;
        }
    }
    gIsRevealed = !gIsRevealed;
    renderBoard(gBoard);
}

// TO USE ONLY LATER for recurrsion
function getNegsPositions(board, rowIdx, colIdx) {
    var negsPositions = [];
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currPos = { i, j };
            negsPositions.push(currPos)
        }
    }
    // console.log( negsPositions );
    return negsPositions;
}