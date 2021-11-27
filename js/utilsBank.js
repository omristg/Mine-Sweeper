function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}


function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}


function drawNum() {
    var idx = getRandomInt(0, gNums.length)
    var num = gNums[idx]
    gNums.splice(idx, 1);
    return num
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function drawNum() {
    return gNums.pop()
}

function shuffle(items) {
    var randIdx, keep
    for (var i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length - 1);

        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}


function drawNum2() {
    var idx = getRandomInt(0, gNums2.length)
    var num = gNums2[idx]
    gNums2.splice(idx, 1)
    return num
}



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function countNegs(mat, rowIdx, colIdx) {

    var counter = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = mat[i][j];
            if (cell === FOOD) {
                counter++
            }
        }
    }
    return counter
}


function printPrimaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
        var item = squareMat[d][d];
        console.log(item);
    }
}


function printSecondaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
        var item = squareMat[d][squareMat.length - d - 1];
        console.log(item);
    }
}

function renderCars() {
    var strHTML = '';
    for (var i = 0; i < gCars.length; i++) {
        strHTML += `<div class="car car${i + 1}" onclick="speedUp(${1})"></div>`;
    }
    // console.log(strHTML)
    var elRoad = document.querySelector('.road');
    elRoad.innerHTML = strHTML;
}



function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function renderCars() {
    var strHTML = '';
    for (var i = 0; i < gCars.length; i++) {
        strHTML += `<div class="car car${i + 1}" onclick="speedUp(${1})"></div>`;
    }
    // console.log(strHTML)
    var elRoad = document.querySelector('.road');
    elRoad.innerHTML = strHTML;
}



function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;

	switch (event.key) {
		case 'ArrowLeft':
			if (j === 0) moveTo(i, gBoard[0].length - 1);
			else moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			if (j === gBoard[0].length - 1) moveTo(i, 0);
			else moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			if (i === 0) moveTo(gBoard.length - 1, j);
			else moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			if (i === gBoard.length - 1) moveTo(0, j);
			else moveTo(i + 1, j);
			break;
	}

}

function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}


// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}


function playSound() {
    var sound = new Audio("sound/pop.mp3");
    sound.play();
}



// add toggle game btn
function toggleGame(elBtn) {
    // console.log('gGameInterval', gGameInterval);
    if (gGameInterval) {
        clearInterval(gGameInterval);
        gGameInterval = null;
        elBtn.innerText = 'Play';
    } else {
        gGameInterval = setInterval(play, GAME_FREQ);
        elBtn.innerText = 'Pause';

    }
}

// Render board whit i j as data id
function renderBoard2(board) {
    // console.table(board);

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var className = (cell) ? 'occupied' : '';
            strHTML += `<td class="${className}" 
            data-i="${i}" data-j="${j}"
            onclick="cellClicked(this,${i},${j})">
            ${cell}</td>`
        }
        strHTML += '</tr>'
    }

    // console.log(strHTML)
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML

}


// Render board whit i j as class after a parent cell class id
function renderBoard3(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })
			cellClass += (currCell.type === FLOOR) ? ' floor' : ' wall';

			strHTML += `<td class="cell ${cellClass}"
			 onclick="moveTo('${i}','${j}')" >`;

			switch (currCell.gameElement) {
				case GAMER:
					strHTML += GAMER_IMG;
					break;
				case BALL:
					strHTML += BALL_IMG;
					break;
			}
			strHTML += '</td>';
		}
		strHTML += '</tr>';
	}
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}


function getEmptyCell() {
	var emptyCells = [];

	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			var currCell = gBoard[i][j];
			if (!currCell.gameElement && currCell.type === FLOOR) {
				var emptyCellPos = { i, j };
				emptyCells.push(emptyCellPos)
			}
		}
	}
	var randomIdx = getRandomInt(0, emptyCells.length)
	var emptyCell = emptyCells[randomIdx];
	return emptyCell
}


// function expandShown(board, elCell, i, j) {
//     var negsCount = board[i][j].minesAroundCount;
//     if (!negsCount) revealNeg(board, i, j)

// }

// function revealNeg(board, rowIdx, colIdx) {
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i > board.length - 1) continue

//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (j < 0 || j > board[0].length - 1) continue
//             if (i === rowIdx && j === colIdx) continue

//             var currCell = board[i][j];
//             if (currCell.isMarked) continue;
//             if (!currCell.isShown) currCell.isShown = true;
//         }
//     }
// }
