const fs = require('fs');

const entries = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
let patterns = [];
let rules = [];
let matchedcombos = [];
let matchesperindex = [];

entries.forEach(entry => {
    const temp = entry.split(' ');
    patterns.push(temp[0]);
    rules.push(temp[1].split(',').map(Number));
});

//part1();
part2();

function part2() {
    for(let i = 0; i < patterns.length; i++) {
        let matches = 0;
        //if it ends with anything other than a . build our batches this way. otherwise put the ? at the start
        if(patterns[i][patterns[i].length-1] !== '.') {
            const combosforstr = generateCombinations(patterns[i] + '?', rules[i]);
            matches = combosforstr.length * combosforstr.length * combosforstr.length * combosforstr.length * generateCombinations(patterns[i], rules[i]).length;
        }
        else {
            const combosforstr = generateCombinations('?' + patterns[i], rules[i]);
            matches = combosforstr.length * combosforstr.length * combosforstr.length * combosforstr.length * generateCombinations(patterns[i], rules[i]).length;
        }
        //matchedcombos = [...matchedcombos, ...combosforstr];
        matchesperindex.push(matches);
    }
    console.log(matchesperindex.reduce((p,sum) => sum + p, 0));
}

function part1() {
    //iterate through all the patterns, generate valid combos, and count the resulting sums
    for(let i = 0; i < patterns.length; i++) {
        const combosforstr = generateCombinations(patterns[i], rules[i]);
        matchedcombos = [...matchedcombos, ...combosforstr];
        matchesperindex.push(combosforstr.length);
    }

    console.log(matchesperindex.reduce((p,sum) => sum + p, 0));
}

function generateCombinations(str, rules) {
    const result = [];

    function recurse(currentStr, index) {
        const i = currentStr.indexOf('?', index);

        if (i === -1) {
            // No more '?' found, add the string to the result
            //add it to the string if it matches the rules. we can get smarter about this as we go if we need to
            if(checkForMatch(currentStr, rules)) result.push(currentStr);
            
        } else {
            // Replace '?' with '.' and '#' and recurse further
            recurse(currentStr.substring(0, i) + '.' + currentStr.substring(i + 1), i + 1);
            recurse(currentStr.substring(0, i) + '#' + currentStr.substring(i + 1), i + 1);
        }
    }

    recurse(str, 0);
    return result;
}

function checkForMatch(str, rules) {
    let rindex = 0;
    let count = 0;

    for (let i = 0; i < str.length; i++) {
        if (str[i] === '#') {
            count++;
        } else {
            if (count > 0) {
                // Check count against the current rule
                if (rindex >= rules.length || count !== rules[rindex]) {
                    return false;
                }
                rindex++;
                count = 0;
            }
        }
    }

    if (count > 0) {
        if (rindex >= rules.length || count !== rules[rindex]) {
            return false;
        }
        rindex++;
    }

    // Ensure all rules are checked
    return rindex === rules.length;
}