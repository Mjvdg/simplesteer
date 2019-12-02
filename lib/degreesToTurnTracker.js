"use strict";
const DB = require('./db/Repo');
const State = require('./state');
const Calc = require('./Calc');
const isYoung = require('./isYoung');

const DegreesToTurnTracker = (function () {
  let historys = [];
  function update(currentLocation) {
    const antennaToFrontAxleDistance = DB.getSettings().machine.antennaToFrontAxleDistance
    const { timeAheadSeconds, minimumDistance } = DB.getSettings().targetPoint;
    let driveBearing = State.driveBearing;
    let abLineBearing = State.abLineBearing;
    let wheelToTargetPointDistance = State.currentSpeedKmh * 1000 / 60 / 60 * timeAheadSeconds;
    if (wheelToTargetPointDistance < minimumDistance) {
      wheelToTargetPointDistance = minimumDistance;
    }

    const wheelPosition = Calc.coord(currentLocation, driveBearing, antennaToFrontAxleDistance); // 2 meter vooruit voor wielen

    const TargetPositionCorner = Calc.coord(currentLocation, driveBearing, wheelToTargetPointDistance + antennaToFrontAxleDistance); // +3 meter vooruit

    const targetCrossTrackDistance = Calc.getCrossTrackDistance({ latitude: State.lines.closestLine[0][1], longitude: State.lines.closestLine[0][0] }, TargetPositionCorner, abLineBearing);

    const theTargetPoint = Calc.coord(TargetPositionCorner, abLineBearing - 90, targetCrossTrackDistance); //kan ook -90 zijn //punt op de closestLine
    State.targetPointLocation = theTargetPoint;
    State.wheelPosition = wheelPosition;

    const WheelToTargetBearing = Calc.bearing(wheelPosition, theTargetPoint);

    State.degreesToTurn = Calc.angleSignedDifference(driveBearing, WheelToTargetBearing);

    historys = historys.filter(isYoung);
    historys.push({ date: new Date(), value: State.degreesToTurn });


    //ioRoot.emit('degreesToTurn', { date: new Date(), value: degreesToTurn }); // target

  }

  return {
    update,
    getHistorys: () => historys
  }
}());

module.exports = DegreesToTurnTracker;