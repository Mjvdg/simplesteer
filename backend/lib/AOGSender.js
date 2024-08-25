'use strict';
const nmea = require("nmea-simple");
const net = require('net');
const State = require('./state');

let sockets = [];

let server = net.createServer(function (socket) {
  socket.write('Echo server\r\n');
  sockets.push(socket);

  socket.on('close', function () {
    let index = sockets.indexOf(socket);
    if (index > -1) {
      sockets.splice(index, 1);
    } else {
      console.log('wtff');
    }


  });
});

server.listen(1100);

const AOGSENDER = (() => {
  function send(location) {
    sendGGA(location);
    sendVTG()
  }
  function sendGGA(location) {
    const timestamp = new Date();

    const GGAsentence = nmea.encodeNmeaPacket({
      sentenceId: "GGA",
      time: timestamp,
      latitude: location[1],
      longitude: location[0],
      fixType: "fix",
      satellitesInView: 40
    }, 'GP');

    sockets.forEach(socket => {
      //socket.write(location + '\r\n');
      socket.write(GGAsentence + '\r\n');
    });
  }

  function sendVTG() {
    const HDTsentence = nmea.encodeNmeaPacket({
      sentenceId: "HDT",
      heading: State.driveBearing
    }, 'GP');
    sockets.forEach(socket => {
      //socket.write(location + '\r\n');
      socket.write(HDTsentence + '\r\n');
    });
  }

  return {
    send
  };
})();

module.exports = AOGSENDER;