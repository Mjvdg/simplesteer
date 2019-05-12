"use strict";
const Calc = require('./Calc');
const State = require('./state');
const sendClosestLine = require('./socketIO-send.js').sendClosestLine;

const ClosestLine = (function() {
  let closestLine;
  return {
    get: () => closestLine,    
    update
  };
  function update(currentLocation) {
    let shortestDistance = Infinity;
    State.lines.forEach(item => {
      // zoek dichtsbijzijnde lijn
      if ( Calc.distance(currentLocation, item.A) < shortestDistance ) {
        shortestDistance = Calc.distance(item.A, currentLocation);
        closestLine = item;
      }
    });
    sendClosestLine(closestLine);
  }
}());

module.exports = ClosestLine;
