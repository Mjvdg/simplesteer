"use strict";
module.exports = {
  socketIoPort: 3000,
  rtkClient: [
    {
      host: 'localhost',
      port: 1234
    }, 
    {
      host: 'localhost',
      port: 1235
    }, 
  ],
  arduino:{
    path: '/dev/steermotor',
    baudRate: 115200,
  },
  lineCount: 200,
  debug: true,

}