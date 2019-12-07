"use strict";
const State = require('./state');
const DB = require('./db/Repo');
const Calc2 = require('./Calc2');
const turf = require('@turf/turf');

function getClosestLineNr(currentLocation){
    if(DB.getSettings().mode === 'curvedABlines'){
        return getClosestCurveLineNr(currentLocation);
    }
    if(DB.getSettings().mode === 'straightABlines'){
        return getClosestStraightLineNr(currentLocation);
    }
}

function getClosestStraightLineNr(currentLocation) {
    let abLineXTD = Calc2.getCrossTrackDistance(State.pointA.location, currentLocation, State.abLineBearing);
    let lineNr = Math.round((abLineXTD + DB.getSettings().lineOffset) / (DB.getSettings().machineWidth / 100));
    return lineNr
}
function getClosestCurveLineNr(currentLocation) {
    let crosstrackDistance = turf.pointToLineDistance(currentLocation, State.curvedLines.abLine) * 1000;
    let lineNr = Math.round((crosstrackDistance + DB.getSettings().lineOffset) / (DB.getSettings().machineWidth / 100));
    return lineNr
}

module.exports = getClosestLineNr;