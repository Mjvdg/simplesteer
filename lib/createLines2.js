"use strict";
const State = require('./state');
const Calc = require('./Calc');
const DB = require('./db/Repo');
const sendMapLines = require('./socketIO-send').sendMapLines;
const turf = require('@turf/turf');
const getClosestLineNr = require('./getClosestLineNr');
const createAndSendLines = () => {
    const pointA = State.pointA.location;
    const pointB = State.pointB.location;
    const currentLocation = State.gps.currentLocation;
    const abLineBearing = State.abLineBearing;

    let lineNr = getClosestLineNr(currentLocation);

    State.lines.others = [];
    
    State.lines.closestLine = createLine(0);
    for(let i=1; i<2; i++){
        State.lines.others.push(createLine(-i));
        State.lines.others.push(createLine(i));
    }
    

    function createLine(offset){
        const offsetPointA = Calc.coord(pointA, abLineBearing - 90, (-lineNr + offset) * DB.getSettings().machineWidth /100);
        const offsetPointB = Calc.coord(pointB, abLineBearing - 90, (-lineNr + offset) * DB.getSettings().machineWidth /100);
        const [extendedA, extendedB] = extendLine(offsetPointA, offsetPointB);
        return [
            extendedA, 
            extendedB
        ];
    }
    sendMapLines();
}

function extendLine(pointA, pointB){
    let a = turf.point([pointA.longitude, pointA.latitude]);
    let b = turf.point([pointB.longitude, pointB.latitude]);

    let bearing = turf.rhumbBearing(a, b);
    let options = {units: 'kilometers'};
    let extendedB = turf.rhumbDestination(b, 1, bearing, options);
    let extendedA = turf.rhumbDestination(a, 1, bearing-180, options);
    
    return [ extendedA.geometry.coordinates, extendedB.geometry.coordinates ];
}
module.exports = createAndSendLines;

// calculate crosstrackdistance between current location and abline
// devide that crosstrackdistance by machinewidth
// round that solution to an integer
// draw line with offset from AB line that is integer*machinewidth