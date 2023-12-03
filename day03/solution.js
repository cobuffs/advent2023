const fs = require('fs');

const entries = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");

let schematic = [];
let parts = [];
let possiblegears = new Map();

(entries).forEach(entry => {
    schematic.push(entry.split(''));
});

//get all the part numbers. check if they have a part touching them
for(var row = 0; row < schematic.length; row++) {
    let partnum = {'num':'', 'row': row, 'mincol':0, 'maxcol':0};
    for (var col = 0; col < schematic[row].length; col++) {
        const entry = schematic[row][col];
        if(entry >= '0' && entry <= '9') {
            //we have a number
            if(partnum.num.length == 0) {
                partnum.mincol = col;
            }
            partnum.num = partnum.num + entry;
            if(col == schematic[row].length - 1) {
                partnum.maxcol = col;
                parts.push(partnum);
            }
            
        } else {
            if (partnum.num.length > 0) {
                partnum.maxcol = col - 1;
                parts.push(partnum);
            }
            //reset
            partnum = {'num':'', 'row': row, 'mincol':0, 'maxcol':0};
        }
    }
}

part1();

function part1() {
    let sum = 0;
    parts.forEach(part => { 
        //need to check mincol-1, maxcol+1
        //look for a part
        let found = false;
        let row = part.row - 1;
        let startingcol = part.mincol - 1 < 0 ? 0 : part.mincol - 1;
        let endingcol = part.maxcol + 1 >= schematic[0].length ? part.maxcol : part.maxcol + 1;
        if (row >= 0) {
            for(var i = startingcol; i <= endingcol && !found; i++) {
                const entry = schematic[row][i];
                if(!((entry >= '0' && entry <= '9') || entry == '.')) {
                    found = true;
                    if(entry == '*') processgear(row, i, part);
                    break;
                }
            }
        }
        if(!found){
            row = part.row;
            const entry1 = schematic[row][startingcol];
            const entry2 = schematic[row][endingcol];
            if(!((entry1 >= '0' && entry1 <= '9') || entry1 == '.')) {
                found = true;
                if(entry1 == '*') processgear(row, startingcol, part);
            }
            if(!((entry2 >= '0' && entry2 <= '9') || entry2 == '.')) {
                found = true;
                if(entry2 == '*') processgear(row, endingcol, part);
            }
            row = part.row + 1;
            if(row < schematic.length) {
                for(var i = startingcol; i <= endingcol && !found; i++) {
                    const entry = schematic[row][i];
                    if(!((entry >= '0' && entry <= '9') || entry == '.')) {
                        found = true;
                        if(entry == '*') processgear(row, i, part);
                        break;
                    }
                }
            }
        }
      
        if(found) sum += parseInt(part.num,10);

    });
    console.log(sum);

    let gearsum = 0;
    possiblegears.forEach((gear,k) => {
        if (gear.parts.length == 2) {
            gearsum = gearsum + (parseInt(gear.parts[0],10) * parseInt(gear.parts[1],10));
        }
    });
    console.log(gearsum);
}

function processgear(row, col, part) {
    const key = row + "," + col;
    if(possiblegears.has(key)) {
        let gear = possiblegears.get(key);
        gear.parts.push(part.num);
    } else {
        let gear = {parts:[]};
        gear.parts.push(part.num);
        possiblegears.set(key, gear);
    }
}