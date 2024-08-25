"use strict";
const Calc2 = require('./Calc2');
const State = require('./state');
const isYoung = require('./isYoung');
const turf = require('@turf/turf');
const DB = require('./db/Repo');
const Enums = require('./enums');
const CROSSTRACKDISTANCETRACKER = (function(){
  let historys = [];
  let crossTrackDistance = 0;

  function update(currentLocation){
    if(DB.getSettings().mode === Enums.SteeringMode.straightABlines){
      crossTrackDistance = Calc2.getCrossTrackDistance(State.lines.closestLine[0], currentLocation, State.abLineBearing);
    }
    if(DB.getSettings().mode === Enums.SteeringMode.curvedLines || DB.getSettings().mode === Enums.SteeringMode.path){
      crossTrackDistance = turf.pointToLineDistance(currentLocation, turf.lineString(State.curvedLines.closestLine)) * 1000;
    }
    historys = historys.filter(isYoung);
    historys.push({ date: new Date(), value: crossTrackDistance*100 }); 
  }
  function getCrossTrackDistanceWithTime(){
    let heading = State.driveBearing;
    let inverter = 1;
    if(Math.abs(Calc2.angleSignedDifference(heading, State.abLineBearing)) > 90){
        inverter = -1;
    }
    return { date: new Date(), value:crossTrackDistance*100*inverter };      
  }
  function get(){
    return crossTrackDistance;
  }
  function clear(){
    historys = [];
  }
  return {
    update: update,
    get,
    getCrossTrackDistanceWithTime,
    getHistorys: () => historys,
    clear
  }  
}());

module.exports = CROSSTRACKDISTANCETRACKER;