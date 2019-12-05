"use strict";
const events = require('events');
const Calc = require('./Calc');

let state = {
  autoSteer: false,
  isAutosteerAllowed: false,
  currentWheelAngle: undefined,
  degreesToTurn: undefined,
  targetPointLocation: undefined,
  wheelPosition: undefined,
  currentSpeedmms : undefined,
  currentSlope: undefined,
  get currentSpeedKmh(){
    return this.currentSpeedmms / 1000000 * 60 * 60;
  },
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
    },
    clear: function(){
      this.location.latitude = undefined;
      this.location.longitude = undefined;
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
    },
    clear: function(){
      this.location.latitude = undefined;
      this.location.longitude = undefined;
    }
  },
  lines: {
    abLine: {},
    closestLine: {},
    others: [],
  },
  curvedLines: {
    isRecording: false,
    curvedAbLine: []
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
