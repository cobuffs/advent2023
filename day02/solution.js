const fs = require('fs');

const entries = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");

let games = [];

(entries).forEach(entry => {
    const gid = parseInt(entry.split(': ')[0].substring(4), 10);
    const subs = entry.split(': ')[1].split('; ');
    let newgame = {'id': gid, 'subs': processsubs(subs)};
    games.push(newgame);
});

part1();
part2();

function part1() {
    //Determine which games would have been possible if the bag had been loaded with only 12 red cubes, 13 green cubes, and 14 blue cubes. What is the sum of the IDs of those games?
    let ids = [];
    games.forEach(game => {
        if(game.subs.maxr <= 12 && game.subs.maxg <= 13 && game.subs.maxb <= 14) ids.push(game.id);
    });
    console.log(ids.reduce((total, current) => total + current, 0));
}

function part2() {
    let powers = [];
    games.forEach(game => {
        powers.push(game.subs.power);
    });
    console.log(powers.reduce((total, current) => total + current, 0));
}

function processsubs(subs) {
    let newsubs = {'maxr':0, 'maxg':0, 'maxb': 0, 'subs':[], 'power': 0};
    subs.forEach(sub => {
        let newsub = {'r':0,'g':0,'b':0};
        const units = sub.split(', ');
        units.forEach(unit => {
            const count = parseInt(unit.split(' ')[0], 10);
            const color = unit.split(' ')[1];
            if(color == 'green') {
                newsub.g = count;
                if (newsubs.maxg < count) newsubs.maxg = count;
            } else if (color == 'red') {
                newsub.r = count;
                if (newsubs.maxr < count) newsubs.maxr = count;
            } else {
                newsub.b = count;
                if (newsubs.maxb < count) newsubs.maxb = count;
            }
        });
        newsubs.subs.push(newsub);
    });
    newsubs.power = newsubs.maxb * newsubs.maxr * newsubs.maxg;
    return newsubs;
}