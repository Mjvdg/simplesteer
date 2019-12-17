"use strict";
const events = require('events');
const Calc2 = require('./Calc2');

let state = {
  autoSteer: false,
  isAutosteerAllowed: false,
  isCurvedRecording: false,
  isWorkRecording: false,
  currentWheelAngle: undefined,
  degreesToTurn: undefined,
  targetPointLocation: undefined,
  currentSpeedmms: undefined,
  currentSlope: undefined,
  bigWorkPolygons: [],
  get currentSpeedKmh() {
    return this.currentSpeedmms / 1000000 * 60 * 60;
  },
  gps: {
    currentLocation: undefined,
    leftLocation: undefined,
    rightLocation: undefined,
    receiverDistance: undefined,
    heading: undefined,
    isReversing: false,
  },
  pointA: {
    location: [],
    get isSet() {
      return this.location.length === 2;
    },
    here: function () {
      this.location = state.gps.currentLocation;
    },
    clear: function () {
      this.location = [];
    }
  },
  pointB: {
    location: [],
    get isSet() {
      return this.location.length === 2;
    },
    here: function () {
      this.location = state.gps.currentLocation;
    },
    clear: function () {
      this.location = [];
    }
  },
  lines: {
    closestLine: {},
    others: [],
  },
  curvedLines: {
    isRecording: false,
    currentExtraDistance: 0,
    abLine: [],
    closestLine: [],
    others: [],
  },
  driveBearing: undefined,
  get abLineBearing() {
    const pointA = this.pointA.location;
    const pointB = this.pointB.location;
    return Calc2.bearing(pointA, pointB);
  },
  eventEmitters: {
    steering: new events.EventEmitter(),
  }
}

module.exports = state;
