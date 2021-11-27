'use strict'

const HEART = '🖤';
const MINE = '💣';
const FLAG = '🚩';

var gTimerIntervalId;
var gBoard;

var gGame = {
    isOn: false,
    hasAnyCellClicked: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    hints: 3,
    safeClicks: 3,
    isHintOn: false
}


var gLevel = {
    SIZE: 4,
    MINES: 2,
    FLAGS: 2
}


function init() {
    gBoard = createBoard(gLevel.SIZE);
    renderBoard(gBoard);
    statusSmiley('normal');
    displayLife();
    displayHints();
    displayFlags();
}


function resetGame() {

    gGame.hasAnyCellClicked = false;
    gGame.isOn = false;
    gSeconds = gMinutes = 0;
    gGame.secsPassed = 0;
    gGame.lives = 3;
    gGame.hints = 3;
    gGame.safeClicks = 3;
    gLevel.FLAGS = gLevel.MINES;
    clearInterval(gTimerIntervalId);
    document.querySelector('.timer').innerText = '00:00';
    document.querySelector('.score').style.display = 'none';
    document.querySelector('.lower-info-line').style.display = 'block'
    var elWinnersContainer = document.querySelector('.winners-container')
    elWinnersContainer.style.visibility = 'hidden';
    init();
}


function setLevel(size) {
    gLevel.SIZE = size

    switch (gLevel.SIZE) {
        case 4:
            gLevel.FLAGS = gLevel.MINES = 2;
            break;
        case 8:
            gLevel.FLAGS = gLevel.MINES = 12;
            break;
        case 12:
            gLevel.FLAGS = gLevel.MINES = 30;
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
    return board
}


function setRandomMines(clickedCellPos) {

    var randPossisions = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if ((i === clickedCellPos.i) && (j === clickedCellPos.j)) continue;
            randPossisions.push(gBoard[i][j]);
        }
    }

    for (i = 0; i < gLevel.MINES; i++) {
        var randIdx = getRandomInt(0, randPossisions.length);
        var randPos = randPossisions.splice(randIdx, 1)[0];
        randPos.isMine = true;
    }
}


function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j];
            var cellClass = getClassName({ i, j })

            strHTML += `<td class="cell ${cellClass} hidden" 
			 onclick="cellClicked(this, ${i},${j})" 
             oncontextmenu="cellMarked(this, ${i},${j})">`;

            strHTML += '</td>';
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


function firstMove(i, j) {
    gGame.isOn = true;
    gGame.hasAnyCellClicked = true;
    gTimerIntervalId = setInterval(timer, 1000);

    setRandomMines({ i, j });
    SetMinesNegsCount(gBoard);
}


function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j]
    if (gGame.hasAnyCellClicked && !gGame.isOn) return;
    else if (!gGame.isOn) firstMove(i, j);
    else if (cell.isMarked) return;
    else if (gGame.isHintOn) return fireHint(i, j);

    cell.isShown = true;
    if (cell.isMine) return mineHit(elCell, i, j);

    elCell.classList.remove('hidden');
    elCell.innerHTML = cell.minesAroundCount;

    if (!cell.minesAroundCount) {
        elCell.innerHTML = '';
        expandShown(i, j);
    }
    checkGameOver();
}


function expandShown(rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = gBoard[i][j];
            if (currCell.isMarked) continue;

            currCell.isShown = true;
            showHideCell({ i, j }, 'show');
            renderCell({ i, j }, currCell.minesAroundCount);
        }
    }
}


function mineHit(elCell, cellI, cellJ) {
    gGame.lives--;
    displayLife();

    gBoard[cellI][cellJ].isShown = true;
    showHideCell({ i: cellI, j: cellJ }, 'show');
    renderCell({ i: cellI, j: cellJ }, MINE);
    elCell.style.backgroundColor = 'rgb(148, 9, 9)';

    if (gGame.lives) return setTimeout(hideMineBack, 400, elCell, cellI, cellJ);

    gGame.isOn = false;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine) {
                currCell.isShown = true;
                showHideCell({ i, j }, 'show');
                renderCell({ i: i, j: j }, MINE);
            }
        }
    }
    elCell.style.backgroundColor = 'rgb(148, 9, 9)';
    statusSmiley('loose');
    clearInterval(gTimerIntervalId);
}


function hideMineBack(elCell, i, j) {
    gBoard[i][j].isShown = false;
    elCell.style.backgroundColor = '';
    showHideCell({ i, j }, 'hide');
    renderCell({ i, j }, '');
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
    elScore.innerText = `Your Score is: ${gGame.secsPassed}`;
    elScore.style.display = 'block';
    setTimeout(registerScore, 250);
}


function cellMarked(elCell, i, j) {
    var cell = gBoard[i][j];
    if (cell.isShown) return;
    
    if (!cell.isMarked) {
        if (!gLevel.FLAGS) return
        renderCell({ i, j }, FLAG);
        gLevel.FLAGS--;
    } else {
        renderCell({ i, j }, '');
        gLevel.FLAGS++;
    }
    elCell.classList.toggle('marked');
    cell.isMarked = !cell.isMarked;
    displayFlags();

    if (!gGame.hasAnyCellClicked) firstMove();
    checkGameOver();
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



