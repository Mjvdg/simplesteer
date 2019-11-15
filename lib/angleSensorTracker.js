"use strict";

const State = require('./state');
const DB = require('./db/Repo');
const isYoung = require('./isYoung');
let historys = [];
const AngleSensorTracker = (() => {
  function addRaw(rawAngle) {
    let currentWheelAngle = getCurrentWheelAngle(rawAngle);
    State.currentWheelAngle = currentWheelAngle;
    historys = historys.filter(isYoung);
    historys.push({ date: new Date(), value: currentWheelAngle })
  }

  return {
    addRaw,
    getHistorys: () => historys,
  }

})();

function getCurrentWheelAngle(rawAngle) {
  let maxSteeringAngle = DB.getSettings().machine.maxSteeringAngle;
  let rawPotVal = DB.getSettings().steeringAngleSensor;
  let straightOffset = rawAngle - rawPotVal.straight;
  let currentWheelAngle;
  if (rawPotVal.maxLeft > rawPotVal.maxRight) {
    if (rawAngle >= rawPotVal.straight) { // links
      currentWheelAngle = -straightOffset * (maxSteeringAngle / (rawPotVal.maxLeft - rawPotVal.straight));
    }
    if (rawAngle < rawPotVal.straight) { // rechts
      currentWheelAngle = -straightOffset * (maxSteeringAngle / (rawPotVal.straight - rawPotVal.maxRight));
    }
  } else {
    if (rawAngle >= rawPotVal.straight) { // rechts
      currentWheelAngle = straightOffset * (maxSteeringAngle / (rawPotVal.maxRight - rawPotVal.straight));
    }
    if (rawAngle < rawPotVal.straight) { // links
      currentWheelAngle = straightOffset * (maxSteeringAngle / (rawPotVal.straight - rawPotVal.maxLeft));
    }
  }
  return currentWheelAngle;
}


module.exports = AngleSensorTracker;