"use strict";
const Calc = require('./Calc');
const Send = require('./socketIO-send.js');
const getClosestLine = require('./closestLine').get;
const State = require('./state');

Calc.angleSignedDifference
const CROSSTRACKDISTANCETRACKER = (function(){
  let historys = [];
  let crossTrackDistance = 0;

  function update(currentLocation){
    crossTrackDistance = Calc.getCrossTrackDistance(getClosestLine().A, currentLocation, State.abLineBearing);
    historys = historys.filter(isYoung);
    historys.push({ date: new Date(), value: crossTrackDistance*100 }); 
    send();
  }
  function send(){
    let heading = State.driveBearing;
    let inverter = 1;
    if(Math.abs(Calc.angleSignedDifference(heading, State.abLineBearing)) > 90){
        inverter = -1;
    }
    Send.sendCrossTrackDistance({ date: new Date(), value:crossTrackDistance*100*inverter });      
  }
  function get(){
    return crossTrackDistance;
  }

  return {
    update,
    get,
    getHistory: function(){
      return historys;
    }
  }
}());

function isYoung(history){
  return (history.date.getTime() + 2*60*1000) > new Date().getTime();
}
module.exports = CROSSTRACKDISTANCETRACKER;