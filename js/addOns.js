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
    renderBoard(gBoard);
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
    if (!gGame.hints) return
    gGame.isHintOn = true;
    gGame.hints--
    displayHints();
    // TODO: Change to all screen
    document.querySelector('.board').style.cursor = 'grabbing';
}


function fireHint(board, i, j) {
    showHideNegs(board, i, j, 'reveal');
    renderBoard(board);
    showHideNegs(board, i, j, 'hide');

    document.querySelector('.board').style.cursor = 'grab';
    setTimeout(shutDownHint, 1000, board);
}

function shutDownHint(board) {
    gGame.isHintOn = false;
    renderBoard(board)
    document.querySelector('.board').style.cursor = 'pointer';
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

    document.querySelector('.hints').style.display = 'none';
    document.querySelector('.score').style.display = 'none';

    var elWinnersContainer = document.querySelector('.winners-container')
    elWinnersContainer.style.visibility = 'visible';

    var strHTML = '';
    var currWinner = localStorage.getItem('winner');
    strHTML += `${currWinner}\n`

    elWinnersContainer.innerText += strHTML;

}