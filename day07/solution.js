const fs = require('fs');

const entries = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");

let hands = [];
entries.forEach(entry => {
    //lines are broken into [hand, bet];
    let [hand, bet] = entry.split(' ');
    bet = parseInt(bet, 10);
    hand = hand.split('');
    //hands.push({'hand':hand, 'type': getpokertype(hand), 'bet': bet});
    hands.push({'hand':hand, 'type': getpokertype(hand), 'bet': bet});
});

hands = hands.sort(comparehands);

//figure out the total winnings
let rank = 1;
let winnings = 0;
for(let i = 0; i < hands.length; i++) {
    winnings += rank++ * hands[i].bet;
}
console.log(winnings);


//custom sort for cards
function comparecards(card1, card2) {
    const cardvalues = {'A': 14, 'K': 13, 'Q': 12, 'J': 1, 'T': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2};

    return cardvalues[card1] - cardvalues[card2];
}

function comparehands(hand1, hand2) {
    
    const type1 = hand1.type;
    const type2 = hand2.type;

    if (type1 !== type2) {
        return type1 - type2;
    }

    for (let i = 0; i < hand1.hand.length; i++) {
        const cardComparison = comparecards(hand1.hand[i], hand2.hand[i]);
        if (cardComparison !== 0) {
            return cardComparison > 0 ? 1 : -1;
        }
    }

    return 0;
}

function getpokertype(hand) {
    let counts = {};
    let wildcards = 0;

    hand.forEach(card => {
        if (card === 'J') wildcards++;
        else counts[card] = (counts[card] || 0) + 1;
    });

    let pairs = 0;
    let threes = 0;
    let fours = 0;
    let fives = 0;

    Object.values(counts).forEach(count => {
        if (count === 2) pairs++;
        if (count === 3) threes++;
        if (count === 4) fours++;
        if (count === 5) fives++;
    });

    if(wildcards > 0) {
        if (wildcards === 5 || wildcards === 4 || fours > 0 || (threes > 0 && wildcards > 1) || (pairs === 1 && wildcards === 3)) {
            return 7;
        } else if ((pairs === 0 && wildcards === 3 ) || (pairs === 1 && wildcards === 2) || (threes === 1 && wildcards === 1)) {
            fours++;
        } else if ((pairs === 0 && wildcards === 2) || (pairs > 0 && wildcards === 1)) {
            threes++;
            pairs--;
        } else {
            pairs++;
        }
    }
   
    if (fives === 1) return 7;
    if (fours === 1) return 6;
    if (threes === 1 && pairs === 1) return 5;
    if (threes === 1) return 4;
    if (pairs === 2) return 3;
    if (pairs === 1) return 2;
    return 1;
}