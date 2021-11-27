'use stict'

function getClassName(location) {
    var cellClass = `cell-${location.i}-${location.j}`
    return cellClass;
}


function renderCell(location, value) {
    var cellSelector = `.${getClassName(location)}`;
    var elCell = document.querySelector(cellSelector);
    if (!value)  elCell.innerHTML = '';
    else elCell.innerHTML = value;
}


function showHideCell(location, action) {
    var cellSelector = `.${getClassName(location)}`;
    var elCell = document.querySelector(cellSelector);
    if (action === 'show') elCell.classList.remove('hidden');
    else if (action === 'hide') elCell.classList.add('hidden');
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function renderCellsForHint(location) {
    var value;
    var cellSelector = `.${getClassName(location)}`;
    var elCell = document.querySelector(cellSelector);
    
    var negs = countNegMines(gBoard, location.i, location.j)
    if (!negs) value = '';
    else if (gBoard[location.i][location.j].isMine) value = MINE
    else value = negs;
    
    elCell.innerHTML = value;
}


// Prevent right mouse click
document.querySelector('table').addEventListener('contextmenu', event => event.preventDefault());
