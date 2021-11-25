'use stict'



function getClassName(location) {
    // var cellClass = 'cell-' + location.i + '-' + location.j;
    var cellClass = `cell${location.i}-${location.j}`;
    return cellClass;
}


// // Convert a location object {i, j} to a selector and render a value in that element
// function renderCell(location, value) {
// 	var cellSelector = '.' + getClassName(location)
// 	var elCell = document.querySelector(cellSelector);
// 	elCell.innerHTML = value;
// }



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// Prevent right mouse click
document.querySelector('table').addEventListener('contextmenu', event => event.preventDefault());