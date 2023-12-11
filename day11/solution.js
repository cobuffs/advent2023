const fs = require('fs');

const entries = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
let space = [];
let galaxies = {};
let emptyrows = [];
entries.forEach((entry, index) => {
    let row = entry.split('');
    space.push(row);
    if(row.every(element => element === '.')) {
        emptyrows.push(index);
    }
});

//need to insert vertical space in each column that has no galaxies
let emptycols = [];
for(let col = 0; col < space[0].length; col++) {
    let galaxycount = 0;
    for(let row = 0; row < space.length; row++) {
        if(space[row][col] === '#') { 
            galaxycount++;
            break;
        }
    }
    if(galaxycount === 0) {
        //we need a new column
        emptycols.push(col);
    }
}

//now we need a list of all galaxies
let galaxyid = 0;
for(let row = 0; row < space.length; row++) {
    for(let col = 0; col < space[row].length; col++) {
        if(space[row][col] === '#') {
            let galaxy = {'row': row, 'col': col, 'galaxyid': galaxyid++};
            galaxies[`${galaxy.galaxyid}`] = galaxy;
        }
    }
}

//for part 2 we need to update the galaxy coordinates based on how many empty rows or columns are to the left or above them
let multiplier = 999999;
Object.values(galaxies).forEach(galaxy => {
    //how many empty col are to the left of my col
    const colx = emptycols.filter(e => e < galaxy.col).length;
    const rowx = emptyrows.filter(e => e < galaxy.row).length;
    galaxy.row += (rowx * multiplier);
    galaxy.col += (colx * multiplier);
});

const combos = getUniqueCombinations(Object.keys(galaxies));
let distances = {};
let sum = 0;
for(let i = 0; i < combos.length; i++) {
    const start = combos[i][0];
    const end = combos[i][1];
    const distance = manhattanDistance(galaxies[start], galaxies[end]);
    distances[combos[i]] = distance;
    sum += distance;
}

console.log(sum);

function manhattanDistance(point1, point2) {
    return Math.abs(point1.col - point2.col) + Math.abs(point1.row - point2.row);
}

function getUniqueCombinations(array) {
    const combinations = new Set();

    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            combinations.add([array[i], array[j]].sort().toString());
        }
    }

    return Array.from(combinations).map(combination => combination.split(','));
}