const fs = require('fs');

let entries = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
let locations = {};
let startingloc = '';
let possibles = new Set();
for(let row = 0; row < entries.length; row++) {
    let rowvals = entries[row].split('');
    for(let col = 0; col < rowvals.length; col++) {
        locations[`${row},${col}`] = {
            'row': row,
            'col': col,
            'value': rowvals[col],
            'inloop': false,
            'distance': Infinity
        }
        if(rowvals[col] === 'S') {
            startingloc = `${row},${col}`;
            locations[`${row},${col}`].value = '7';
            locations[`${row},${col}`].inloop = true;
            locations[`${row},${col}`].distance = 0;
        }
    }
}

console.log(startingloc);
let location = locations[startingloc];
location.inloop = true;
let previous = null;
let max = 0;
let path = 1;
let shoelacecoords = [{'x':location.col, 'y':location.row}];

while(true) {
    let nextlocation = nextloc(location, previous);
    if(`${nextlocation.row},${nextlocation.col}` === startingloc) break;
    path++;
    nextlocation.distance = location.distance + 1;
    nextlocation.inloop = true;
    previous = location;
    location = nextlocation;
    shoelacecoords.push({'x':location.col, 'y':location.row});
    max = location.distance;
}
//close the loop
console.log(max / 2);
part2();
nonlolp2();

function nextloc(location, previousloc) {
    if (previousloc === null){
        previousloc = {'row': -10,
        'col': -10,
        'value': '.',
        'inloop': false,
        'distance': Infinity};
    }
    let trynext = {'row':location.row, 'col':location.col};

    switch(location.value) {
        case 'S':
            //need to check all 4 directions for a pipe
            //N
            const N = locations[`${location.row - 1},${location.col}`];
            if(N.value === '|' || N.value === '7' || N.value === 'F') trynext.row = N.row;
            else {
                //nothing to the north check east
                const E = locations[`${location.row},${location.col+1}`];
                if(E.value === '-' || E.value === 'J' || E.value === '7') trynext.col = E.col;
                else {
                    //try S
                    const S = locations[`${location.row + 1},${location.col}`];
                    if(S.value === '|' || S.value === 'L' || S.value === 'J') trynext.row = S.row;
                }
            }
            break;
        case '|':
            //| is a vertical pipe connecting north and south.
            //check N
            if(location.row - 1 !== previousloc.row) trynext.row = location.row - 1;
            else trynext.row = location.row + 1;
            break;
        case '-':
            //- is a horizontal pipe connecting east and west.
            if(location.col + 1 !== previousloc.col) trynext.col = location.col + 1;
            else trynext.col = location.col - 1;
            break;
        case 'L':
            //L is a 90-degree bend connecting north and east.
            if(location.row - 1 !== previousloc.row) trynext.row = location.row - 1;
            else trynext.col = location.col + 1;
            break;
        case 'J':
            //J is a 90-degree bend connecting north and west.
            if(location.row - 1 !== previousloc.row) trynext.row = location.row - 1;
            else trynext.col = location.col - 1;
            break;
        case '7':
            if(location.row + 1 !== previousloc.row) trynext.row = location.row + 1;
            else trynext.col = location.col - 1;
            break;
        case 'F':
            if(location.row + 1 !== previousloc.row) trynext.row = location.row + 1;
            else trynext.col = location.col + 1;
            break;
        case '.':
            break;
    }

    return locations[`${trynext.row},${trynext.col}`];
}

function part2() {
    //populate possibles with any node not part of the loop
    for(let row = 0; row < entries.length; row++) {
        for(let col = 0; col < entries[row].length; col++) {
            let tile = locations[`${row},${col}`];
            if(!tile.inloop) possibles.add(`${row},${col}`);
        }
    }
    
    //lets start by removing all the ones on the edges
    //from the left
    for(let row = 0; row < entries.length; row++) {
        let foundloop = false;
        for(let col = 0; col < entries[row].length; col++) {
            //go until you hit the loop
            let tile = locations[`${row},${col}`];
            if(!tile.inloop && !foundloop) possibles.delete(`${row},${col}`);
            else if(tile.inloop) {
                foundloop = true;
                break;
            }
        }
    }

    //from the right
    for(let row = 0; row < entries.length; row++) {
        let foundloop = false;
        for(let col = entries[row].length - 1; col >=0; col--) {
            let tile = locations[`${row},${col}`];
            if(!tile.inloop && !foundloop) possibles.delete(`${row},${col}`);
            else if(tile.inloop) {
                foundloop = true;
                break;
            }
        }
    }

    //from the north
    for(let col = 0; col < entries[0].length; col++) {
        let foundloop = false;
        for(let row = 0; row < entries.length; row++) {
            //go until you hit the loop
            let tile = locations[`${row},${col}`];
            if(!tile.inloop && !foundloop) possibles.delete(`${row},${col}`);
            else if(tile.inloop) {
                foundloop = true;
                break;
            }
        }
    }

    //from the south
    for(let col = 0; col < entries[0].length; col++) {
        let foundloop = false;
        for(let row = entries.length - 1; row >= 0; row--) {
            //go until you hit the loop
            let tile = locations[`${row},${col}`];
            if(!tile.inloop && !foundloop) possibles.delete(`${row},${col}`);
            else if(tile.inloop) {
                foundloop = true;
                break;
            }
        }
    }

    //count the possibles on row 58-85
    let blobcount = 0;
    for(let row = 57; row < 85; row++) {
        for(let col = 0; col < entries[row].length; col++) {
            if(possibles.has(`${row},${col}`)) blobcount++;
        }
    }
    console.log(blobcount);
    printgrid();
    
}

function nonlolp2() {
    console.log(calculatePolygonArea(shoelacecoords) - (path / 2) + 1);
}

function calculatePolygonArea(vertices) {
    let area = 0;

    for (let i = 0; i < vertices.length; i++) {
        let j = (i + 1) % vertices.length; // Wrap around to the first vertex
        area += vertices[i].x * vertices[j].y;
        area -= vertices[j].x * vertices[i].y;
    }

    return Math.abs(area / 2);
}


function printgrid() {
    for(let row = 0; row < entries.length; row++) {
        let line = '';
        for(let col = 0; col < entries[row].length; col++) {
            const tile = locations[`${row},${col}`];
            if(tile.inloop || tile.value === 'I') {
                let printviz = '';
                switch(tile.value) {
                    case 'L':
                        printviz = '└';
                        break;
                    case '-':
                        printviz = '─';
                        break;
                    case '|':
                        printviz = '│';
                        break;
                    case 'J':
                        printviz = '┘';
                        break;
                    case '7':
                        printviz = '┐';
                        break;
                    case 'F':
                        printviz = '┌';
                        break;
                }
                line = line + printviz;
            }
            else if (!possibles.has(`${row},${col}`)) line = line + ' ';
            else line = line + ' ';
        }
        console.log(line);
    }
}