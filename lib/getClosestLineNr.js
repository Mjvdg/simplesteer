"use strict";
const State = require('./state');
const DB = require('./db/Repo');
const Calc2 = require('./Calc2');
const turf = require('@turf/turf');
const ExtraDistance = require('./extraDistance');


function getClosestLineNr(currentLocation) {
    if (DB.getSettings().mode === 'curvedABlines') {
        return getClosestCurveLineNr(currentLocation);
    }
    if (DB.getSettings().mode === 'straightABlines') {
        return getClosestStraightLineNr(currentLocation);
    }
}

function getClosestStraightLineNr(currentLocation) {
    let abLineXTD = Calc2.getCrossTrackDistance(State.pointA.location, currentLocation, State.abLineBearing);
    let lineNr = Math.round((abLineXTD + DB.getSettings().lineOffset) / (DB.getSettings().machineWidth / 100));
    return lineNr;
}
function getClosestCurveLineNr(currentLocation) {
    let line = State.curvedLines.abLine;
    let nearestPointOnABLine = turf.nearestPointOnLine(turf.lineString([line[0], line[line.length - 1]]), currentLocation).geometry.coordinates;
    let crosstrackDistance = turf.distance(currentLocation, nearestPointOnABLine) * 1000;
    let nearestPointOnLineBearing = Calc2.bearing(State.curvedLines.abLine[0], nearestPointOnABLine);
    let currentLocationBearing = Calc2.bearing(State.curvedLines.abLine[0], currentLocation);
    let signedDifference = Calc2.angleSignedDifference(nearestPointOnLineBearing, currentLocationBearing);
    let isOtherSide = Math.sign(signedDifference) === -1;
    let extraDistance = ExtraDistance.get();

    if (isOtherSide) {
        crosstrackDistance *= -1;
    }
    let lineNr = Math.round((crosstrackDistance + DB.getSettings().lineOffset - extraDistance) / (DB.getSettings().machineWidth / 100));

    return lineNr;
}

module.exports = getClosestLineNr;