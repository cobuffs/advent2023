const fs = require('fs');

const entries = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
let cards = [];
let score = 0;
let scratchcards = new Map();

(entries).forEach(entry => {
    const idarr = entry.split(': ')[0].split(' ');
    const id = parseInt(idarr[idarr.length-1], 10);
    const numbers = entry.split(': ')[1].split(' | ');
    const winners = numbers[0].trim().replace(/\s+/g, ' ').split(' ').map((v,i) => {return parseInt(v,10);});
    const mynumbers = numbers[1].trim().replace(/\s+/g, ' ').split(' ').map((v,i) => {return parseInt(v,10);});
    let card = {'id': id, 'winners': winners, 'mynumbers':mynumbers, 'score': 0, 'matched':0};
    //calculate the score
    for(var i = 0; i < winners.length; i++) {
        const digit = winners[i];
        if(mynumbers.includes(digit)) {
            if(card.score == 0) card.score = 1;
            else card.score = card.score * 2;
            card.matched++;
        }
    }
    score += card.score;
    cards.push(card);
});

part2();

function part2() {
    for(var i = 0; i < cards.length; i++){
        const card = cards[i];
        let cardtracker = null;
        if(scratchcards.has(card.id)) {
            cardtracker = scratchcards.get(card.id);
            cardtracker.instances = cardtracker.instances + 1;
        } else {
            cardtracker = {'card': card, 'instances': 1};
            scratchcards.set(cardtracker.card.id, cardtracker);
        }
        let matchc = cardtracker.card.matched;
        for(var j = 1; j <= matchc; j++) {
            if(scratchcards.has(card.id + j)) {
                let tempcard = scratchcards.get(card.id + j);
                tempcard.instances = tempcard.instances + cardtracker.instances;
                scratchcards.set(card.id + j, tempcard);
            } else {
                let tempcard = {'card': cards[card.id + j - 1], 'instances': cardtracker.instances};
                scratchcards.set(card.id + j, tempcard);
            }
        }
    }

    //add up all the instances
    let newscore = 0;
    scratchcards.forEach((v,k) => {
        newscore += v.instances;
    });
    console.log(newscore);
}