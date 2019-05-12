//http://www.whoi.edu/marine/ndsf/cgi-bin/NDSFutility.cgi?form=0&from=LatLon&to=XY
function translate_coordinates(sLatlong, oLatLong) {
  var xx, yy, r, ct, st, angle;
  //angle = DEG_TO_RADIANS(origin.rotation_angle_degs);
  angle = 0;
  xx = (sLatlong.longitude- oLatLong.longitude) * METERS_DEGLON(oLatLong.latitude);
  yy = (sLatlong.latitude - oLatLong.latitude) * METERS_DEGLAT(oLatLong.latitude);

  r = Math.sqrt(xx * xx + yy * yy);

  if (r) {
      ct = xx / r;
      st = yy / r;
      xx = r * ((ct * Math.cos(angle)) + (st * Math.sin(angle)));
      yy = r * ((st * Math.cos(angle)) - (ct * Math.sin(angle)));
  }

  var sxy = {};
  sxy = { x: xx, y: yy };
  return (sxy);
};

function DegtoRad(x) {
  return x * Math.PI / 180;
}
function RadtoDeg(x) {
  return x * 180 / Math.PI;
}
function METERS_DEGLON(x) {
  var d2r = DegtoRad(x);
  return ((111415.13 * Math.cos(d2r)) - (94.55 * Math.cos(3.0 * d2r)) + (0.12 * Math.cos(5.0 * d2r)));
}

function METERS_DEGLAT(x) {
  var d2r = DegtoRad(x);
  return (111132.09 - (566.05 * Math.cos(2.0 * d2r)) + (1.20 * Math.cos(4.0 * d2r)) - (0.002 * Math.cos(6.0 * d2r)));
}

module.exports = translate_coordinates;