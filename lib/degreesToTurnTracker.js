const DB = require('./db/Repo');
const State = require('./state');
const DegreesToTurnTracker = (function(){
  function update(currentLocation){
    const antennaToFrontAxleDistance = DB.getSettings().machine.antennaToFrontAxleDistance
    
    let driveBearing = State.driveBearing;

    const wheelPosition = Calculations.calculateCoord(currentLocation, driveBearing, antennaToFrontAxleDistance); // 2 meter vooruit voor wielen
    const TargetPositionCorner = Calculations.calculateCoord(currentLocation, driveBearing, DB.settings.getSettings().wheelToTargetPointDistance + antennaToFrontAxleDistance); // +3 meter vooruit

    const targetCrossTrackDistance = Calculations.getCrossTrackDistance(State.lines.closestLine.A, TargetPositionCorner, abLineBearing);
    const theTargetPoint = Calculations.calculateCoord(TargetPositionCorner, abLineBearing - 90, targetCrossTrackDistance); //kan ook -90 zijn //punt op de closestLine

    const WheelToTargetBearing = Calculations.calculateBearing(wheelPosition, theTargetPoint);
    degreesToTurn = Calculations.calculateAngleSignedDifference(driveBearing, WheelToTargetBearing);

    historys = historys.filter(isYoung);
    historys.push({ date: new Date(), value: degreesToTurn });

    ioRoot.emit('degreesToTurn', { date: new Date(), value: degreesToTurn }); // target
  }
  return{
    update
  }
}());


module.exports = DegreesToTurnTracker;