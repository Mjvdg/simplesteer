"use strict";
module.exports = {
  socketIoPort: 3000,
  arduino:{
    path: '/dev/ttyUSB0',
    baudRate: 115200,
  },
  gpsLeft:{
    path: '/dev/ubloxf9pleft'
  },
  gpsRight: {
    path: '/dev/ubloxf9pright'
  },
  debug: false,
  simulator: false,
  ubloxToken: "_REPLACE-WITH-UBLOX-ASSISTNOW-TOKEN_"
}