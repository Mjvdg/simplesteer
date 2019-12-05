const turf = require('@turf/turf');
const Calc = require('./lib/Calc');


let { tPos1, pos1, tPos2, pos2 } = get2RandomPositions();

console.log(1, [pos1.latitude, pos1.longitude], tPos1);
console.log(2, [pos2.latitude, pos2.longitude], tPos2);

console.log(
  'turf: ',
  (turf.bearing(tPos1, tPos2) + 360) % 360,
  'calc: ',
  Calc.bearing(pos1, pos2)
);


function get2RandomPositions() {
  let tPos1 = turf.randomPosition();
  let pos1 = { latitude: tPos1[1], longitude: tPos1[0] };
  let tPos2 = turf.randomPosition();
  let pos2 = { latitude: tPos2[1], longitude: tPos2[0] };

  return { tPos1, pos1, tPos2, pos2 };
}