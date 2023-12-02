const fs = require('fs');

const entries = fs.readFileSync('input1.txt', 'utf8').toString().trim().split("\r\n");

//read each entry, find the first digit and the last digit, turn that into a 2 digit number and sum them all
let values = [];

(entries).forEach(entry => {
    let first = null;
    let last = null;
    let firstDigit = null;
    let lastDigit = null;
    for(var i = 0; i < entry.length; i++) {
        if(entry[i] >= '0' && entry[i] <= '9') {
            first = i;
            firstDigit = entry[i];
            break;
        }
    }
    for(var i = entry.length - 1; i >= 0; i--) {
        if(entry[i] >= '0' && entry[i] <= '9') {
            last = i;
            lastDigit = entry[i];
            break;
        }
    }

    //look for each number - we just need to check before the first digit and after the last digit
    const newCheck1 = entry.substring(0, first);
    const newCheck2 = entry.substring(last + 1);
    let front = checkstrfornum(newCheck1, 0);
    let back = checkstrfornum(newCheck2, 1);
    if(front != -1) {
        firstDigit = front.toString();
    } 
    if(back != -1) {
        lastDigit = back.toString();
    }

    values.push(parseInt(firstDigit + lastDigit, 10));

});
console.log(values.reduce((total, current) => total + current, 0));

function checkstrfornum(str, direction) {
    //direction is from the start or the end
    const checks = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    const digits = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    for (let i = 0; i < digits.length; i++) {
        if(direction == 0) {
            //check from the front
            checks[i] = str.indexOf(digits[i]);
        } else {
            checks[i] = str.lastIndexOf(digits[i]);
        }
    }

    //return the lowest/highest
    let currentIndex = -1;
    let currentVal = -1;
    for(let i = 0; i < checks.length; i++) {
        if(direction == 0) {
            if(checks[i] > -1 && (checks[i] < currentIndex || currentIndex == -1)) {
                currentIndex = checks[i];
                currentVal = i;
            }
        } else {
            if(checks[i] > -1 && checks[i] > currentIndex) {
                currentIndex = checks[i];
                currentVal = i;
            }
        }
    }
    return currentVal;
}