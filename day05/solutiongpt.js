const fs = require('fs');

const entries = fs.readFileSync('input.txt', 'utf8').trim().split("\r\n");
const seeds = entries[0].split(': ')[1].split(' ').map(Number);
let seedRanges = [];
for (let i = 0; i < seeds.length; i += 2) {
    const start = seeds[i];
    const end = start + seeds[i + 1] - 1;
    seedRanges.push([start, end]);
}

let mappings = [[]];
for (let i = 3; i < entries.length; i++) {
    const row = entries[i];
    if (row === '') {
        mappings.push([]);
        continue;
    }

    if (row.charAt(0) > '9') continue;
    const [destination, source, range] = row.split(' ').map(Number);
    const lastMapping = mappings[mappings.length - 1];
    lastMapping.push({
        sourceStart: source,
        sourceEnd: source + range - 1,
        destinationStart: destination
    });
}

function calculateLocation(seedNumber, mappings) {
    let currentNumber = seedNumber;
    for (const mapping of mappings) {
        currentNumber = mapNumber(currentNumber, mapping);
    }
    return currentNumber;
}

function mapNumber(number, mapping) {
    for (const { sourceStart, sourceEnd, destinationStart } of mapping) {
        if (number >= sourceStart && number <= sourceEnd) {
            return number + (destinationStart - sourceStart);
        }
    }
    return number;
}

function part1() {
    const locations = seeds.map(seed => calculateLocation(seed, mappings));
    return Math.min(...locations);
}

function part2() {
    let minLocation = Infinity;
    for (const [start, end] of seedRanges) {
        for (let seed = start; seed <= end; seed++) {
            const location = calculateLocation(seed, mappings);
            minLocation = Math.min(minLocation, location);
        }
    }
    return minLocation;
}

console.log(part1());
console.log(part2());
