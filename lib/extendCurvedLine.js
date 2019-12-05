"use strict";
const turf = require('@turf/turf');

function extendCurvedLine(line) {

  let reverseLine = [...line];
  reverseLine.reverse();

  let almostA = turf.along(turf.lineString(line), 0.005);
  let almostB = turf.along(turf.lineString(reverseLine), 0.005);

  let pointA = line[0];
  let pointB = reverseLine[0];

  let extendedAbearing = turf.bearing(almostA, pointA);
  let extendedBbearing = turf.bearing(almostB, pointB);

  let extendedA = turf.rhumbDestination(pointA, 1, extendedAbearing).geometry.coordinates;
  let extendedB = turf.rhumbDestination(pointB, 1, extendedBbearing).geometry.coordinates;

  return [extendedA, ...line, extendedB];
}

module.exports = extendCurvedLine;
