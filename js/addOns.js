'use strict'


const NORMAL = '😀';
const WIN = '😎';
const LOOSE = '🤯';
const HINT = '💡';

var gSeconds = 0;
var gMinutes = 0;
var gSecondsDisplay = 0;
var gMinutesDisplay = 0;


function statusSmiley(state) {
    var smiley = document.querySelector('.status-smiley')
    switch (state) {
        case 'normal':
            smiley.innerText = NORMAL;
            break;
        case 'win':
            smiley.innerText = WIN;
            break;
        case 'loose':
            smiley.innerText = LOOSE;
            break;
    }
}


function timer() {
    gGame.secsPassed++;
    gSeconds++;
    if (gSeconds / 60 === 1) {
        gSeconds = 0;
        gMinutes++;
        if (gMinutes / 60 === 1) {
            document.querySelector('.too-slow').style.display = 'block';
            clearInterval(gTimerIntervalId);
            gGame.isOn = false
        }
    }
    if (gSeconds < 10) gSecondsDisplay = '0' + gSeconds;
    else gSecondsDisplay = gSeconds;

    if (gMinutes < 10) gMinutesDisplay = '0' + gMinutes;
    else gMinutesDisplay = gMinutes;

    var timerDisplay = document.querySelector('.timer');
    timerDisplay.innerText = `${gMinutesDisplay}:${gSecondsDisplay}`
}


function displayLife() {
    var strHTML = '';
    for (var i = 0; i < gGame.lives; i++) {
        strHTML += HEART;
    }
    var elLife = document.querySelector('.life')
    elLife.innerText = strHTML;
}


function displayHints() {
    var elHint = document.querySelector('.hints');
    elHint.display = 'block'

    var strHTML = '';
    for (var i = 0; i < gGame.hints; i++) {
        strHTML += HINT;
    }
    elHint.innerText = strHTML;
}


function loadHint() {
    if (!gGame.isOn) return
    if (!gGame.hints) return
    gGame.isHintOn = true;
    gGame.hints--
    displayHints();
    document.querySelector('.board').style.cursor = 'grabbing';
}


function fireHint(rowIdx, colIdx) {
    gGame.isOn = false;
    showHideCell({ i: rowIdx, j: colIdx }, 'show')

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard.length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            showHideCell({ i, j }, 'show')
            renderCellsForHint({ i, j });
        }
    }

    document.querySelector('.board').style.cursor = 'grab';
    setTimeout(shutDownHint, 1000, rowIdx, colIdx);
}


function shutDownHint(rowIdx, colIdx) {
    gGame.isOn = true;
    gGame.isHintOn = false;
    if (!gBoard[rowIdx][colIdx].isShown) {
        showHideCell({ i: rowIdx, j: colIdx }, 'hide')
    }

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard.length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            if (!gBoard[i][j].isShown) {
                showHideCell({ i, j }, 'hide')
                renderCell({ i, j }, '');
            }
        }
    }
    document.querySelector('.board').style.cursor = 'pointer';
}


function safeClick(elSafeClick) {
    if (!gGame.isOn) return;
    if (!gGame.safeClicks) return;
    gGame.safeClicks--;
    elSafeClick.innerHTML = `Safe Click left: ${gGame.safeClicks}`
    var safeCells = [];

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            if (!currCell.isShown && !currCell.isMine) {
                safeCells.push({ i, j })
            }
        }
    }
    var randIdx = getRandomInt(0, safeCells.length);
    var randSafeCell = safeCells[randIdx];
    var elSafeCell = document.querySelector(`.cell-${randSafeCell.i}-${randSafeCell.j}`)
    elSafeCell.classList.add('safe');
    setTimeout(removeSafeCell, 500, elSafeCell);
}


function removeSafeCell(elSafeCell) {
    elSafeCell.classList.remove('safe');
}


function displayFlags() {
    var elFlagCount = document.querySelector('.flag-count')
    elFlagCount.innerText = `${FLAG} ${gLevel.FLAGS}`
}


function registerScore() {
    // TODO: continue set multiple items!
    // TODO: Add the currect level
    var currWinner = prompt('Enter your name \nif you want to register score')
    if (!currWinner) return

    localStorage.setItem('winner', `${currWinner} - ${gGame.secsPassed}`)
    var toCheck = localStorage.getItem('winner')
    console.log(toCheck);
    renderWinners()
}


function renderWinners() {
    document.querySelector('.lower-info-line').style.display = 'none';
    document.querySelector('.score').style.display = 'none';

    var elWinnersContainer = document.querySelector('.winners-container')
    elWinnersContainer.style.visibility = 'visible';

    var strHTML = '';
    var currWinner = localStorage.getItem('winner');
    strHTML += `${currWinner}\n`

    elWinnersContainer.innerText += strHTML;
}