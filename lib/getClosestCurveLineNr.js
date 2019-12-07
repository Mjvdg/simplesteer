"use strict";
const turf = require('@turf/turf');
const State = require('./state');
const DB = require('./db/Repo');


function getClosestCurveLineNr(currentLocation) {
    let crosstrackDistance = turf.pointToLineDistance(currentLocation, State.curvedLines.abLine) * 1000;
    let lineNr = Math.round((crosstrackDistance + DB.getSettings().lineOffset) / (DB.getSettings().machineWidth / 100));
    return lineNr
}

module.exports = getClosestCurveLineNr;