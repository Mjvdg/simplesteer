//@ts-check
"use strict"

const Calc2 = require('./Calc2');
const turf = require('@turf/turf');
const State = require('./state');

function get(){
  let line = State.curvedLines.abLine;
  let currentLocation = State.gps.currentLocation;
  let nearestPointOnABLine = turf.nearestPointOnLine(turf.lineString([line[0], line[line.length - 1]]), currentLocation).geometry.coordinates;
  
  let abLineBearing = Calc2.bearing(line[0], line[line.length - 1]);
  
  let crossLine1 = turf.lineString([turf.destination(nearestPointOnABLine, 2, abLineBearing + 90).geometry.coordinates, nearestPointOnABLine]);
  let crossLine2 = turf.lineString([turf.destination(nearestPointOnABLine, 2, abLineBearing - 90).geometry.coordinates, nearestPointOnABLine]);
  
  let intersectPoint;
  let crossLine1Intersects = turf.lineIntersect(crossLine1, turf.lineString(line)).features;
  let crossLine2Intersects = turf.lineIntersect(crossLine2, turf.lineString(line)).features;
  
  let inverseExtraDistance = false;
  if (crossLine1Intersects.length > 0) {
      intersectPoint = crossLine1Intersects[0];
      inverseExtraDistance = false;
  }
  if (crossLine2Intersects.length > 0) {
      intersectPoint = crossLine2Intersects[0];
      inverseExtraDistance = true;
  }
  let extraDistance = 0;
  if(intersectPoint!== undefined){
      extraDistance = turf.distance(intersectPoint, nearestPointOnABLine);
  }    
  if (inverseExtraDistance) {
      extraDistance *= -1;
  }
  
  return extraDistance * 1000;  
}

module.exports = {
  get
};