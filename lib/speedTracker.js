"use strict";
const sendSpeed = require("./socketIO-send").sendSpeed;
const Calc = require('./Calc');

const Speedtracker = (function() {
  let previousLocation;
  function update(currentLocation) {
    if (previousLocation !== undefined) {
      let distance = Calc.distance(previousLocation, currentLocation);
      let kmh = calculateSpeed(distance);
      sendSpeed(kmh);
    }
    previousLocation = currentLocation;
  }
  return {
    update
  };
  function calculateSpeed(distance) {
    let meterPerSecond = distance * 4; //rate
    let kmh = (meterPerSecond * 60 * 60) / 1000;
    return kmh;
  }
}());

module.exports = Speedtracker;