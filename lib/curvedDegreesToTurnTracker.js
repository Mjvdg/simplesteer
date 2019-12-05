const turf = require('@turf/turf');
const State = require('./state');
const DB = require('./db/Repo');
const Calc = require('./Calc');
const isYoung = require('./isYoung');
const CurveddegreesToTurnTracker =  (function () {
  let historys = [];

  function update(currentLocation) {
    const antennaToFrontAxleDistance = DB.getSettings().machine.antennaToFrontAxleDistance;
    const { timeAheadSeconds, minimumDistance } = DB.getSettings().targetPoint;
    let driveBearing = State.driveBearing;
    let wheelToTargetPointDistance = State.currentSpeedKmh * 1000 / 60 / 60 * timeAheadSeconds;

    if (wheelToTargetPointDistance < minimumDistance) {
      wheelToTargetPointDistance = minimumDistance;
    }
    const tcurrentLocation = [currentLocation.longitude, currentLocation.latitude];
    const wheelPosition = turf.rhumbDestination(tcurrentLocation, antennaToFrontAxleDistance/1000, driveBearing) // 2 meter vooruit voor wielen
    const targetPositionCorner = turf.rhumbDestination(tcurrentLocation, antennaToFrontAxleDistance/1000+wheelToTargetPointDistance/1000, driveBearing);
    

    const targetPoint = turf.nearestPointOnLine(turf.lineString(State.lines.curvedAbLine), targetPositionCorner);
    State.targetPointLocation = targetPoint.geometry.coordinates;
    State.wheelPosition = wheelPosition.geometry.coordinates;

    const wheelToTargetBearing = turf.bearing(wheelPosition, targetPoint);

    State.degreesToTurn = Calc.angleSignedDifference(driveBearing, wheelToTargetBearing);
    historys = historys.filter(isYoung);
    historys.push({ date: new Date(), value: State.degreesToTurn });

  }
  return {
    update,
    getHistorys: () => historys
  }
}());


module.exports = CurveddegreesToTurnTracker;