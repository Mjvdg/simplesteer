"use strict";
const set = function(db){
  db.defaults({
    abPoints: [
      { 
        title: 'example',
        a:{
          latitude: 50.95160,
          longitude: 2.64623,
        },
        b:{
          latitude: 50.95160,
          longitude: 2.646222
        },
        time: new Date()
      }
    ],
    settings: {
      machineWidth: 140,
      steering:{
        frontAxleToTargetPointDistance: 3,
        pwm: 255,
        maxWheelSweep: 45,
        antennaToWheelsDistance: 1.5,
      },
      steeringAngleSensor: {
        maxLeft: 381,
        straight: 500,
        maxRight: 1000
      },
      antennaHeight: 2.60,
    }
  
  }).write();
}

module.exports = set;