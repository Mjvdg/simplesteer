"use strict";
const Calc = require('./Calc');
const State = require('./state');


const CROSSTRACKDISTANCETRACKER = (function(){
  let historys = [];
  let crossTrackDistance = 0;

  function update(currentLocation){
    crossTrackDistance = Calc.getCrossTrackDistance({longitude: State.lines.closestLine[0][0], latitude: State.lines.closestLine[0][1]}, currentLocation, State.abLineBearing);
    historys = historys.filter(isYoung);
    historys.push({ date: new Date(), value: crossTrackDistance*100 }); 
  }
  function getCrossTrackDistanceWithTime(){
    let heading = State.driveBearing;
    let inverter = 1;
    if(Math.abs(Calc.angleSignedDifference(heading, State.abLineBearing)) > 90){
        inverter = -1;
    }
    return { date: new Date(), value:crossTrackDistance*100*inverter };      
  }
  function get(){
    return crossTrackDistance;
  }
  return {
    update: update,
    get,
    getCrossTrackDistanceWithTime,
    getHistorys: () => historys
  }
}());

function isYoung(history){
  return (history.date.getTime() + 2*60*1000) > new Date().getTime();
}
module.exports = CROSSTRACKDISTANCETRACKER;