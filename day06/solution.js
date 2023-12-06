const races = [{'time':53, 'distance':275}, {'time':71, 'distance':1181}, {'time':78, 'distance':1215}, {'time':80, 'distance':1524}];
const sampleraces = [{'time':7, 'distance':9}, {'time':15, 'distance':40}, {'time':30, 'distance':200}];

const part2race = {'time': 53717880, 'distance': 275118112151524};
//const part2race = {'time': 71530, 'distance': 940200};

//Your toy boat has a starting speed of zero millimeters per millisecond. For each whole millisecond you spend at the beginning of the race holding down the button, the boat's speed increases by one millimeter per millisecond.

//binary search the minimum value to beat the record, find how much additional time is available, and do some math

let ways = [];

races.forEach(race => {
    //brute force it
    victoryconditions = 0;
    for(var i = 0; i < race.time; i++) {
        const speed = i;
        const distance = speed * (race.time - i);
        if(distance > race.distance) victoryconditions++;
    }
    ways.push(victoryconditions);
});


//for part 2, just find the first number that beats the record, find out how far that is away from 0, double it, subtract that from the time, and ship it

let currenttry = part2race.time / 2;
while(true) {
    let distance = currenttry * (part2race.time - currenttry);
    if (distance > part2race.distance) currenttry = Math.floor(currenttry / 2);
    else {
        //keep adding 1 to it until it breaks it again
        for(var i = 1; distance < part2race.distance; i++){
            currenttry++;
            distance = currenttry * (part2race.time - currenttry);
        }
        break;
    }
}

console.log(`From ${currenttry} to ${part2race.time - currenttry}: ${part2race.time - currenttry - currenttry + 1}`);
//5733493