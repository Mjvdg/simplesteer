const DB = require('./db/Repo');

const DegreesToTurnTracker = (function(){
  function update(){
    const closestLine = CLOSESTLINE.get();
    const antennaToWheelsDistance = DB.settings.getSteering().antennaToWheelsDistance;
    
    let driveBearing = GPSFUSER.getHeading();

    const WheelPosition = Calculations.calculateCoord(currentLocation, driveBearing, antennaToWheelsDistance); // 2 meter vooruit voor wielen
    const TargetPositionCorner = Calculations.calculateCoord(currentLocation, driveBearing, DB.settings.getSteering().wheelToTargetPointDistance + antennaToWheelsDistance); // +3 meter vooruit

    const targetCrossTrackDistance = Calculations.getCrossTrackDistance(closestLine.A, TargetPositionCorner, abLineBearing);
    const theTargetPoint = Calculations.calculateCoord(TargetPositionCorner, abLineBearing - 90, targetCrossTrackDistance); //kan ook -90 zijn //punt op de closestLine

    const WheelToTargetBearing = Calculations.calculateBearing(WheelPosition, theTargetPoint);
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