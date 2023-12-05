//sample

const fs = require('fs');

const entries = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");

const seeds = entries[0].split(': ')[1].split(' ');
let seedranges = [];
let seedtosoil = {'sources':[], 'destinations':[]};
let soiltofert = {'sources':[], 'destinations':[]};
let ferttowater = {'sources':[], 'destinations':[]};
let watertolight = {'sources':[], 'destinations':[]};
let lighttotemp = {'sources':[], 'destinations':[]};
let temptohumidity = {'sources':[], 'destinations':[]};
let humiditytoloc = {'sources':[], 'destinations':[]};

for(var i = 0; i < seeds.length; i = i+2) {
    const seedstart = parseInt(seeds[i], 10);
    const seedend = seedstart + parseInt(seeds[i+1],10) -1;
    seedranges.push([seedstart, seedend]);
}


let mapper = 1;
for(var i = 3; i < entries.length; i++) {
    const row = entries[i];
    if (row == '') continue;
    let mapworker = null;
    switch (mapper) {
        case 1:
            mapworker = seedtosoil;
            break;
        case 2: 
            mapworker = soiltofert;
            break;
        case 3: 
            mapworker = ferttowater;
            break;
        case 4: 
            mapworker = watertolight;
            break;
        case 5: 
            mapworker = lighttotemp;
            break;
        case 6: 
            mapworker = temptohumidity;
            break;
        case 7: 
            mapworker = humiditytoloc;
            break;
    }
    
    if(row.includes('map')) {
        mapper++;
    } else {
        //we have a valid row: destinationstart, sourcestart, range
        const formatted = row.split(' ');
        mapworker.sources.push([parseInt(formatted[1],10), parseInt(formatted[2], 10)]);
        mapworker.destinations.push([parseInt(formatted[0],10), parseInt(formatted[2], 10)]);
    }
}

part1();
part2();

function part1() {
    let locations = [];
    for(var i = 0; i < seeds.length; i++) {
        //walk the chain
        locations.push(walkthechain(parseInt(seeds[i],10)));
    }
    
    console.log(Math.min(...locations));

}

function part2() {
    //try to brute force
    let minloc = Infinity;
    for(var i = 0; i < seedranges.length; i++) {
        let workingseed = seedranges[i][0];
        const seedend = seedranges[i][1];
        while (workingseed < seedend) {
            const loc = walkthechain(workingseed);
            if(loc < minloc) minloc = loc;
            workingseed++;
        }
    }

    console.log(minloc);
}

function getpossibleranges() {

}
function walkthechain(seednum) {
    //look up the soil
    let foundsoil = false;
    let foundfert = false;
    let foundwater = false;
    let foundlight = false;
    let foundtemp = false;
    let foundhumidity = false;
    let foundlocation = false;
    let soil = -1;
    let fert = -1;
    let water = -1;
    let light = -1;
    let temp = -1;
    let humidity = -1;
    let location = -1;

    for (var i = 0; i < seedtosoil.sources.length; i++) {
        const seedstart = seedtosoil.sources[i][0];
        const seedend = seedstart + seedtosoil.sources[i][1] - 1;
        const delta = seedtosoil.destinations[i][0] - seedstart;
        if(seednum >= seedstart && seednum <= seedend) {
            soil = seednum + delta;
            //console.log(`Seed number ${seednum} corresponds to soil number ${soil}`);
            foundsoil = true;
            break;
        }
    }
    if(!foundsoil) {
        soil = seednum;
        //console.log(`Seed number ${seednum} corresponds to soil number ${soil}`);
    }

    for (var i = 0; i < soiltofert.sources.length; i++) {
        const soilstart = soiltofert.sources[i][0];
        const soilend = soilstart + soiltofert.sources[i][1] - 1;
        const delta = soiltofert.destinations[i][0] - soilstart;
        if(soil >= soilstart && soil <= soilend) {
            fert = soil + delta;
            foundfert = true;
            break;
        }
    }
    if(!foundfert) {
        fert = soil;
    }

    for (var i = 0; i < ferttowater.sources.length; i++) {
        const fertstart = ferttowater.sources[i][0];
        const fertend = fertstart + ferttowater.sources[i][1] - 1;
        const delta = ferttowater.destinations[i][0] - fertstart;
        if(fert >= fertstart && fert <= fertend) {
            water = fert + delta;
            foundwater = true;
            break;
        }
    }
    if(!foundwater) {
        water = fert;
    }

    for (var i = 0; i < watertolight.sources.length; i++) {
        const waterstart = watertolight.sources[i][0];
        const waterend = waterstart + watertolight.sources[i][1] - 1;
        const delta = watertolight.destinations[i][0] - waterstart;
        if(water >= waterstart && water <= waterend) {
            light = water + delta;
            foundlight = true;
            break;
        }
    }
    if(!foundlight) {
        light = water;
    }
    
    for (var i = 0; i < lighttotemp.sources.length; i++) {
        const lightstart = lighttotemp.sources[i][0];
        const lightend = lightstart + lighttotemp.sources[i][1] - 1;
        const delta = lighttotemp.destinations[i][0] - lightstart;
        if(light >= lightstart && light <= lightend) {
            temp = light + delta;
            foundtemp = true;
            break;
        }
    }
    if(!foundtemp) {
        temp = light;
    }

    for (var i = 0; i < temptohumidity.sources.length; i++) {
        const tempstart = temptohumidity.sources[i][0];
        const tempend = tempstart + temptohumidity.sources[i][1] - 1;
        const delta = temptohumidity.destinations[i][0] - tempstart;
        if(temp >= tempstart && temp <= tempend) {
            humidity = temp + delta;
            foundhumidity = true;
            break;
        }
    }
    if(!foundhumidity) {
        humidity = temp;
    }
    
    for (var i = 0; i < humiditytoloc.sources.length; i++) {
        const humiditystart = humiditytoloc.sources[i][0];
        const humidityend = humiditystart + humiditytoloc.sources[i][1] - 1;
        const delta = humiditytoloc.destinations[i][0] - humiditystart;
        if(humidity >= humiditystart && humidity <= humidityend) {
            location = humidity + delta;
            foundlocation = true;
            break;
        }
    }
    if(!foundlocation) {
        location = humidity;
    }

    return location;
}

//for part 2, take a seed start and a seed end and find all the soil rules that apply to it. remember to handle the case if the seed is 1-100 and we have a soil that takes 40-50, we still need to process seeds 1-39 and 51-100. same logic should apply to all the rules

//get the list of humidities that result in the smallest locs 1806134966 - (1806134966 + 198620952 - 1)
//get the list of temps that result in the list of humidities above