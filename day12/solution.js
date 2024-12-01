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
    let ogcounts = [];
    for(let i = 0; i < patterns.length; i++) {
        let matches = [];
        let matcha = 0;
        let matchb = 0;
        let matchc = 0;
        //if it ends with anything other than a . build our batches this way. otherwise put the ? at the start
        //lets try it both ways and pick the higher one?
        //181279939277 too low
        //708425515353 too low
        //815364548481
        
        const og = generateCombinationCounts(patterns[i], rules[i]);
        const ogstartswith = generateCombinationCounts('?' + patterns[i], rules[i]);
        const ogendswith = generateCombinationCounts(patterns[i] + '?', rules[i]);
        const ogsurrounds = generateCombinationCounts('?' + patterns[i] + '?', rules[i]);

        //this should be too high...
        const case1 = og * ogsurrounds * og * ogsurrounds * og;
        const case2 = ogendswith * ogendswith * ogendswith * ogendswith * og;
        const case3 = og * ogstartswith * ogstartswith * ogstartswith * ogstartswith;
        const options = [case1, case2, case3];
        matchesperindex.push(Math.max(...options));
        ogcounts.push(og);
        
        //console.log(`Matches for ${patterns[i]} is ${Math.max(...matches)}`);


        //patterns are:
        // 0 - p ? p ? p ? p ? p

        // 1 - p | ? p ? | p | ? p ? | p
        // 2 - p ? | p ? | p ? | p ? | p
        // 3 - p | ? p | ? p | ? p | ? p

        //p starts with a .
        //2 - always works

        //p ends with a p .
        //3 - always works

        //p starts with a ?
        //2 - always works when the starting ? is a .

        //p ends with a ?
        //3 - always works with the ending ? is a .

        //p starts with a #
        //2 - only works when we force the ? to a .

        //p ends with a #
        //3 - only works when we force the ? to a .


        // p | ? p ? | p | ? p ? | p only works if p starts with and ends with a . or we turn both ends to a .

        //starts and ends with a ? or a .
        // if(patterns[i][0] !== '#' && patterns[i][patterns[i].length - 1] !== '#') {
        //     //if it starts with a ?, we have some options
        //     if(patterns[i][0] === '?') {
        //         //if we flip it to a #, we can only try use cases with the middles are .s
        //     }

        //     //if it ends with a ? we have some options
        //     let p1 = '.' + patterns[i].substring(1, patterns[i].length - 2) + '.';
        //     let p2 = 
        
        // } else {
        //     //starts or ends with a #
        // }

        // const patternc = generateCombinationCounts('?' + patterns[i] + '?', rules[i]);
        // matchc = og * og * og * patternc * patternc;

        // // p ? | p ? | p ? | p ? | p - only works if p starts with a . , we turn our ? into a ., or we turn the first ? in the pattern to a .
        // // try all 3 and pick the most successful outcome

        // //starts with a ? or a .
        // if(patterns[i][0] !== '#') {
        //     const patterna = generateCombinationCounts(patterns[i] + '?', rules[i]);
        //     matcha = patterna * patterna * patterna * patterna * og;
        // } 

        // p | ? p | ? p | ? p | ? p - only works if p ends with a ., we turn our ? into a ., or we turn the ending ? in the pattern to a .
        // try all 3 and pick the most successful outcome

        //ends with a ? or a .


        //also want to handle the case of surrounding the OG string with ?s. when we do this, we get 2 of those and 3 OG strings
        // p ? p ? p ? p ? p
  

        // let newpattern = patterns[i] + '?' + patterns[i] + '?' + patterns[i] + '?' + patterns[i] + '?' + patterns[i];
        // let numiterations = 0;
        // //find the minimum string from the right that can meet the requirements of the rules
        // while(true) {
        //     let strtest = '';
        //     let strlen = 1;
            
        //     while(true) {
        //         if(checkIfValid(strtest, rules[i])) break;
        //         strtest = newpattern.substring(newpattern.length - strlen);
        //         //newpattern = newpattern.substring(0,newpattern.length - strlen + 1);
        //         strlen++;
        //     }

        //     //do it again until we find a string that can hit all the rules
        //     while(true) {
        //         const combos = generateCombinationCounts(strtest, rules[i]);
        //         if(combos > 0) {
        //             //we hit a valid batch
        //             numiterations++;
        //             break;
        //         }
        //         strtest = newpattern.substring(newpattern.length - strlen);
        //         //newpattern = newpattern.substring(0,newpattern.length - strlen + 1);
        //         strlen++;
        //     }
        //     let finish = false;
        //     if(newpattern.length - strtest.length < strtest.length) {
        //         //combine them back
        //         strtest = newpattern + strtest;
        //         finish = true;
        //     }
        //     let newrules = rules[i];
        //     if(finish) {
        //         for(let j = numiterations; j < 6; j++) {
        //             newrules = [...newrules, ...rules[i]];
        //         }
        //     }
        //     const combos = generateCombinationCounts(strtest, newrules);
        //     matchesperindex.push(combos);
        //     newpattern = newpattern.substring(0,newpattern.length - strlen + 1);
        //     if(finish || newpattern.length === 0) break;
        // }

        //keep doing this until we would be left with a string from the left that would be too small. have that be our largest string which will probably blow the fuck up


        //what if we figure out the minimum sized batch to still hit all the rules and leave that at the end and maximize the other batches?

    }
    console.log(`Part 1: ${ogcounts.reduce((p,sum) => sum + p, 0)}`);
    console.log(matchesperindex.reduce((p,sum) => sum + p, 0));
}

function checkIfValid(str, rules) {
    //the number of #s + ?s + .s should be >= the number of rules + rules.length - 1
    const rulesum = rules.reduce((p,sum) => sum + p, 0);
    if(countHashes(str) + countQuestionMarks(str) + countPeriods(str) >= rulesum) return true;
    return false;
}

function countHashes(str) {
    const matches = str.match(/#/g);
    return matches ? matches.length : 0;
}

function countQuestionMarks(str) {
    const matches = str.match(/\?/g);
    return matches ? matches.length : 0;
}

function countPeriods(str) {
    const matches = str.match(/\./g);
    return matches ? matches.length : 0;
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

function generateCombinationCounts(str, rules) {
    let result = 0;

    function recurse(currentStr, index) {
        const i = currentStr.indexOf('?', index);

        if (i === -1) {
            // No more '?' found, add the string to the result
            //add it to the string if it matches the rules. we can get smarter about this as we go if we need to
            if(checkForMatch(currentStr, rules)) result++;
            
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