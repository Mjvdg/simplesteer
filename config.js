"use strict";
module.exports = {
  socketIoPort: 3000,
  arduino:{
    path: '/dev/ttyUSB0',
    baudRate: 115200,
  },
  gpsLeft:{
    path: '/dev/ttyACM0'
  },
  gpsRight: {
    path: '/dev/ttyACM1'
  },
  debug: true,
}