"use strict";
const State = require('./state');
const Calc = require('./Calc');
const Config = require('./config.js');
const translate_coordinates = require('./latLonToXy');
const DB = require('./db/Repo');
const sendSVGdata = require('./socketIO-send').sendSVGdata;

const createLines = () => {
  const pointA = State.pointA.location;
  const pointB = State.pointB.location;
  if(Config.debug){
    console.log(`A: ${JSON.stringify(pointA)}`);
    console.log(`B: ${JSON.stringify(pointB)}`);
  }  
  // const distance = Calc.distance(pointA, pointB);
  // State.abLineBearing = Calc.bearing(pointA, pointB);
  const abLineBearing = State.abLineBearing;
  const centerLocation = State.centerLocation;
  // let centerLocation = Calc.coord(pointA, State.abLineBearing, distance / 2);
  // State.centerLocation = centerLocation;

  State.xyLines = [];
  State.lines = [];
  for (let i = -Config.lineCount; i <= Config.lineCount; i++) {
    const offset = i * (DB.getSettings().machineWidth / 100.0); // cm omzetten naar meter
    // console.log(offset);
    const offsetPointA = Calc.coord(pointA, abLineBearing - 90, offset);
    const offsetPointB = Calc.coord(pointB, abLineBearing - 90, offset);
    State.lines.push({ A: offsetPointA, B: offsetPointB });
    State.xyLines.push({
      A: translate_coordinates(offsetPointA, centerLocation),
      B: translate_coordinates(offsetPointB, centerLocation),
    });
  }
  sendSVGdata();
}

module.exports = createLines;

