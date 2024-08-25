//@ts-check
"use strict"

const DB = require('./db/Repo');
const turf = require('@turf/turf');
const State = require('./state');

const WheelPosition = (() => {
  let wheelPosition = undefined;

  function update() {
    let driveBearing = State.driveBearing;
    let currentLocation = State.gps.currentLocation;
    const antennaToFrontAxleDistance = DB.getSettings().machine.antennaToFrontAxleDistance;
    wheelPosition = turf.rhumbDestination(currentLocation, antennaToFrontAxleDistance / 1000, driveBearing); // 2 meter vooruit voor wielen
  }

  return {
    get: () => wheelPosition.geometry.coordinates,
    getTurf: () => wheelPosition,
    update
  }


})();


module.exports = WheelPosition