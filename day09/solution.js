const fs = require('fs');

let entries = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");

let nextvalues = [];


for(let i = 0; i < entries.length; i++) {
    entries[i] = entries[i].split(' ').map(Number);
    entries[i] = entries[i].reverse();
    const lastnum = entries[i][entries[i].length - 1];
    nextvalues.push(processit(entries[i]) + lastnum);
}

console.log(nextvalues.reduce((total, current) => total + current, 0));

function processit(entries) {
    //need to find the next number in the sequence by taking the diffs between all the elements
    let diffs = [];
    for(let i = 0; i < entries.length - 1; i++) {
        const first = entries[i];
        const second = entries[i+1];
        const diff = second - first;
        diffs.push(diff);
    }
    if (diffs.every(element => element === 0)) {
        return 0;
    }
    else {
        return diffs[diffs.length - 1] + processit(diffs);
    }
}