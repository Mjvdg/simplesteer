const turf = require('@turf/turf');
const State = require('./state');
const Calc2 = require('./Calc2');
const DB = require('./db/Repo');
const IoSend = require('./socketIO-send');


const WorkRecorder = (() => {

  let isRecording = false;
  let previousLocation = [0, 0];
  let fastCouter = 0;
  let latestTwoRecordedPoints = [];

  function setIsRecording(isRec) {
    isRecording = isRec;
    State.isWorkRecording = isRec;
    if (!isRec) {
      latestTwoRecordedPoints = [];
    }
  }

  function updateLocation(location) {
    if (Calc2.distance(previousLocation, location) > 1 && isRecording) {
      previousLocation = location;
    } else {
      return;
    }

    let driveBearing = State.driveBearing;
    let machineWidth = DB.getSettings().machineWidth;    
    let leftpoint = Calc2.coord(location, driveBearing - 90, machineWidth / 100 / 2);
    let rightPoint = Calc2.coord(location, driveBearing + 90, machineWidth / 100 / 2);

    if (isRecording) {
      if(latestTwoRecordedPoints.length === 0){
        latestTwoRecordedPoints = [leftpoint, rightPoint];    
      }
      IoSend.sendFastRecordedPoints([leftpoint, ...latestTwoRecordedPoints, rightPoint]);
      State.bigWorkPolygons.push([[leftpoint, ...latestTwoRecordedPoints, rightPoint]]);
      fastCouter++;
    }
    
    if (fastCouter > 25) {
      fastCouter = 0;
      IoSend.sendBigRecordedWorkPoints();
    }

    latestTwoRecordedPoints = [leftpoint, rightPoint];
  }

  return {
    updateLocation,
    setIsRecording,
    getIsRecording: () => isRecording,
  }
})();


module.exports = WorkRecorder;