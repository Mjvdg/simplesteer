"use strict";
const events = require('events');
const Calc = require('./Calc');

let state = {
  autoSteer: false,
  gps: {
    currentLocation: undefined,
    receiverDistance: undefined,
    heading: undefined,
  },
  pointA:{
    location: {
      latitude: undefined,
      longitude: undefined,
    },
    get isSet(){
      return this.location.latitude != undefined && 
        this.location.longitude != undefined;
    },
    here: function() { 
      this.location = state.gps.currentLocation;
    }
  },
  pointB:{
    location: {
      latitude: undefined,
      longitude: undefined,
    },
    get isSet(){
      
      return this.location.latitude != undefined && 
        this.location.longitude != undefined;
    },
    here: function() {
      this.location = state.gps.currentLocation;
    }
  },
  lines: [],
  xyLines: [],
  driveBearing: undefined,
  get abLineBearing(){
    const pointA = this.pointA.location;
    const pointB = this.pointB.location;
    return Calc.bearing(pointA, pointB);
  },
  get centerLocation(){
    const pointA = this.pointA.location;
    const pointB = this.pointB.location;
    const distance = Calc.distance(pointA, pointB);
    const centerlocation = Calc.coord(pointA, this.abLineBearing, distance / 2);
    return centerlocation;
  },
  eventEmitters: {
    steering: new events.EventEmitter(),
  }
}

module.exports = state;