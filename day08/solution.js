const fs = require('fs');

const entries = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");

const instructions = entries[0].split('');
let mappings = {};

for(let i = 2; i < entries.length; i++) {
    //mappings
    const element = entries[i].split(' = ')[0];
    let possibles = entries[i].split(' = ')[1].substring(1);
    possibles = possibles.substring(0, possibles.length - 1).split(', ');
    const [left, right] = possibles;
    const fullelment = {'element':element, 'left':left, 'right':right};
    mappings[element] = fullelment;
}

//part1();
//part2();
betterpart2();

function part2() {
    //get possible starting points
    let workingpoints = [];
    Object.values(mappings).forEach(map => {
        if(map.element.substring(2) === 'A') {
            workingpoints.push(map.element);
        }
    });
    let instrpointer = 0;
    let done = false;
    while(!done) {
        let nextpoints = [];
        const instr = instructions[instrpointer++ % instructions.length];
        let countofZs = 0;
        for(let i = 0; i < workingpoints.length; i++) {
            if(instr === 'L') {
                const nextpoint = mappings[workingpoints[i]].left;
                nextpoints.push(nextpoint);
                if(nextpoint.substring(2) === 'Z') countofZs++;
            } else {
                const nextpoint = mappings[workingpoints[i]].right;
                nextpoints.push(nextpoint);
                if(nextpoint.substring(2) === 'Z') countofZs++;
            }
        }
        if(countofZs === nextpoints.length) done = true;
        workingpoints = nextpoints;
    }

    console.log(instrpointer);
}

function betterpart2() {
    let workingpoints = [];
    Object.values(mappings).forEach(map => {
        if(map.element.substring(2) === 'A') {
            workingpoints.push(map.element);
        }
    });
    let steps = [];
    for(let i = 0; i < workingpoints.length; i++) {
        steps.push(findstepsforelement(workingpoints[i]));
    }
    console.log(findLCM(steps));
}

function findstepsforelement(element) {
    let instrpointer = 0;
    let done = false;
    let workingelement = mappings[element];
    while(!done) {
        const instr = instructions[instrpointer++ % instructions.length];
        if(instr === 'L') {
            workingelement = mappings[workingelement.left];
        } else {
            workingelement = mappings[workingelement.right];
        }
        if (workingelement.element.substring(2) === 'Z') {
            done = true;
        }
    }
    return instrpointer;
}

function gcd(a, b) {
    if (!b) {
        return a;
    }
    return gcd(b, a % b);
}

function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

function findLCM(array) {
    let result = array[0];
    for (let i = 1; i < array.length; i++) {
        result = lcm(result, array[i]);
    }
    return result;
}

function part1() {
    let instrpointer = 0;
    let done = false;
    let workingelement = mappings['AAA'];
    while(!done) {
        const instr = instructions[instrpointer++ % instructions.length];
        if(instr === 'L') {
            workingelement = mappings[workingelement.left];
        } else {
            workingelement = mappings[workingelement.right];
        }
        if (workingelement.element === 'ZZZ') {
            done = true;
        }
    }
    
    console.log(instrpointer);
}
