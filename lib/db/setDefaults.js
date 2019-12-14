"use strict";
const set = function (db) {
  db.defaults({
    settings: {
      machineWidth: 140,
      lineOffset: 0,
      machine: {
        antennaHeight: 2.66,
        antennaToFrontAxleDistance: 1.01,
        antennaToRearAxleDistance: 1,
        maxSteeringAngle: 45
      },
      steering: {
        method: "hydraulic",
        pid: {
          p: 1,
          i: 0,
          d: 0
        },
        toleranceDegrees: 0.1,
        minimumMotorPwm: 46,
        minimumPulseDuration: 18
      },
      steeringAngleSensor: {
        maxLeft: 381,
        straight: 500,
        maxRight: 1000
      },
      targetPoint: {
        timeAheadSeconds: 1.5,
        minimumDistance: 0.33
      },
      ntrip: {
        host: "flepos.vlaanderen.be",
        username: "",
        password: "",
        mountpoint: "FLEPOSVRS32GREC",
        port: "2101"
      },
      mode: "straightABlines"
    }
  }).write();
}

module.exports = set;