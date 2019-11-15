"use strict";
const Calc = require('./Calc');
const Speedtracker = (function() {
  let previousLocation;
  let speedkmh;
  function update(currentLocation) {
    if (previousLocation !== undefined) {
      let distance = Calc.distance(previousLocation, currentLocation);
      speedkmh = calculateSpeed(distance);
    }
    previousLocation = currentLocation;
  }
  return {
    update,
    getCurrentSpeed: () => speedkmh
  };
  function calculateSpeed(distance) {
    let meterPerSecond = distance * 4; //rate
    let kmh = (meterPerSecond * 60 * 60) / 1000;
    return kmh;
  }
}());

module.exports = Speedtracker;