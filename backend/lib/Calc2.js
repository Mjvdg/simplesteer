//https://megocode3.wordpress.com/2008/02/05/haversine-formula-in-c/
//Returns the distance in meters
function distance(position1, position2) {
  let latlong1 = {
    latitude: position1[1],
    longitude: position1[0]
  }
  let latlong2 = {
    latitude: position2[1],
    longitude: position2[0]
  } 

  var r = 6371000;
  var dLat = degToRad(latlong2.latitude - latlong1.latitude);
  var dLon = degToRad(latlong2.longitude - latlong1.longitude);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(latlong1.latitude)) * Math.cos(degToRad(latlong2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.asin(Math.min(1, Math.sqrt(a)));
  var d = r * c;
  return d;
};

function bearing(position1, position2) {
  let latlong1 = {
    latitude: position1[1],
    longitude: position1[0]
  }
  let latlong2 = {
    latitude: position2[1],
    longitude: position2[0]
  } 

  var lat1 = degToRad(latlong1.latitude);
  var lon1 = latlong1.longitude;
  var lat2 = degToRad(latlong2.latitude);
  var lon2 = latlong2.longitude;
  var dLon = degToRad(lon2 - lon1);
  var y = Math.sin(dLon) * Math.cos(lat2);
  var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  var brng = (radToDeg(Math.atan2(y, x)) + 360) % 360;
  return brng;
};



//https://rbrundritt.wordpress.com/2008/10/14/calculate-destination-coordinate/
function coord(originlt, brng, arcLength) {
  let origin = {
    latitude: originlt[1],
    longitude: originlt[0]
  }
  var earthRadius = 6371000; //radius in m

  var lat1 = degToRad(origin.latitude);
  var lon1 = degToRad(origin.longitude);
  var centralAngle = arcLength / earthRadius;
  var lat2 = Math.asin(Math.sin(lat1) * Math.cos(centralAngle) + Math.cos(lat1) *
      Math.sin(centralAngle) * Math.cos(degToRad(brng)));
  var lon2 = lon1 + Math.atan2(Math.sin(degToRad(brng)) * Math.sin(centralAngle) * Math.cos(lat1),
      Math.cos(centralAngle) - Math.sin(lat1) * Math.sin(lat2));

  // return new LatLong(RadtoDeg(lat2), RadtoDeg(lon2));
  //var LatLong = { latitude: radToDeg(lat2), longitude: radToDeg(lon2) };
  var LatLong = [radToDeg(lon2), radToDeg(lat2)];
  return LatLong;
};

function degToRad(x) {
  return x * Math.PI / 180;
}
function radToDeg(x) {
  return x * 180 / Math.PI;
}

function getCrossTrackDistance(startPoint, thirdPoint, startToEndPointBearing) {
  let startToThirdPointDistance = distance(startPoint, thirdPoint);
  let startToThirdPointBearing = bearing(startPoint, thirdPoint);
  let crossTrackDistance = calcXTD(startToThirdPointDistance, startToThirdPointBearing, startToEndPointBearing);
  return crossTrackDistance;
};

//http://www.movable-type.co.uk/scripts/latlong.html
function calcXTD(startToThirdPointDistance, startToThirdPointBearing, startToEndPointBearing) {
  var R = 6371000; //radius in m
  return Math.asin(Math.sin(startToThirdPointDistance / R) * Math.sin(degToRad(startToThirdPointBearing - startToEndPointBearing))) * R;
};

//https://stackoverflow.com/questions/7570808/how-do-i-calculate-the-difference-of-two-angle-measures
function angleSignedDifference(currentAngle, targetAngle) {
  var d = Math.abs(targetAngle - currentAngle) % 360;
  var r = d > 180 ? 360 - d : d;
  //calculate sign
  var sign = (targetAngle - currentAngle >= 0 && targetAngle - currentAngle <= 180) || (targetAngle - currentAngle <= -180 && targetAngle - currentAngle >= -360) ? 1 : -1;
  r *= sign;
  return r;
};
module.exports = {
  distance,
  bearing,
  coord,
  degToRad,
  radToDeg,
  getCrossTrackDistance,
  angleSignedDifference
}