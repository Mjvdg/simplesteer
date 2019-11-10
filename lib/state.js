"use strict";
const events = require('events');
const Calc = require('./Calc');

let state = {
  autoSteer: false,
  gps: {
    currentLocation: undefined,
    leftLocation: undefined,
    rightLocation: undefined,
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
  lines: {
    abLine: {},
    closestLine: {},
    others: []
  },
  driveBearing: undefined,
  get abLineBearing(){
    const pointA = this.pointA.location;
    const pointB = this.pointB.location;
    return Calc.bearing(pointA, pointB);
  },
  eventEmitters: {
    steering: new events.EventEmitter(),
  }
}

module.exports = state;
