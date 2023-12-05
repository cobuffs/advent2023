//sample

const fs = require('fs');

const entries = fs.readFileSync('sample.txt', 'utf8').toString().trim().split("\r\n");

const seeds = entries[0].split(': ')[1].split(' ');
let seedtosoil = {'sources':[], 'destinations':[]};
let soiltofert = {'sources':[], 'destinations':[]};
let ferttowater = {'sources':[], 'destinations':[]};
let watertolight = {'sources':[], 'destinations':[]};
let lighttotemp = {'sources':[], 'destinations':[]};
let temptohumidity = {'sources':[], 'destinations':[]};
let humiditytoloc = {'sources':[], 'destinations':[]};

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

let locations = [];
for(var i = 0; i < seeds.length; i++) {
    //walk the chain
    locations.push(walkthechain(parseInt(seeds[i],10)));
}

console.log(Math.min(...locations));

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
