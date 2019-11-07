"use strict";
const State = require('./state');
const DB = require('./db/Repo');
const Calc = require('./Calc');

function getClosestLineNr(currentLocation){
    let abLineXTD = Calc.getCrossTrackDistance(State.pointA.location, currentLocation, State.abLineBearing);
    let lineNr = Math.round(abLineXTD / (DB.getSettings().machineWidth / 100));
    return lineNr
}

module.exports = getClosestLineNr;