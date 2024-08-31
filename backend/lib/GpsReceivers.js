//@ts-check
"use strict";
const SerialPort = require('serialport');
const Config = require('../config');
const ubxParser = require('./ubxParser');
var ecef = require('geodetic-to-ecef');
//const fs = require('fs');
const sendInfo = require('./socketIO-send').sendInfo;
const { NtripClient } = require('ntrip-client');
const portGpsLeft = new SerialPort(Config.gpsLeft.path, { baudRate: 115200, autoOpen: false });
const portGpsRight = new SerialPort(Config.gpsRight.path, { baudRate: 115200, autoOpen: false });
const Calc2 = require('./Calc2');
const NewLocation = require('./newLocation');
const State = require('./state');
const axios = require('axios').default;
const DB = require('./db/Repo');

let ntripClient = new NtripClient({});
assistNow();
function assistNow() {
  axios.get(`http://online-live1.services.u-blox.com/GetOnlineData.ashx?token=${Config.ubloxToken};gnss=gps,glo,gal;datatype=eph,alm`, { responseType: 'arraybuffer' })
    .then(response => {
      portGpsLeft.write(response.data);
      portGpsRight.write(response.data);
    }).catch(error => {
      console.error('assistnow:', error);
    });
}

ntripConnect();

function ntripConnect() {
  ntripClient = new NtripClient({
    host: DB.getSettings().ntrip.host,
    port: DB.getSettings().ntrip.port,
    mountpoint: DB.getSettings().ntrip.mountpoint,
    username: DB.getSettings().ntrip.username,
    password: DB.getSettings().ntrip.password,
    timeout: 2000,
    interval: 2000 // the interval of send nmea, unit is millisecond
  });


  ntripClient.on('data', (data) => {
    portGpsLeft.write(data);
    portGpsRight.write(data);
  });
  ntripClient.on('close', () => {
    console.log('client close');
  });
  ntripClient.on('error', (err) => {
    console.log('ntrip: ' + err);
  });
  ntripClient.run();
}

const GpsReceivers = (() => {
  portGpsLeft.on('data', (line) => {
    //fs.appendFileSync('logsLeft.ubx', line, { encoding: 'binary' });
    if (!line.toString().startsWith('$GN')) {
      GpsFuser.left(line);
    } else {
      console.log('NMEA0: ' + line.toString());
    }
  });
  portGpsRight.on('data', (line) => {
    //fs.appendFileSync('logsRight.ubx', line, { encoding: 'binary' });
    if (!line.toString().startsWith('$GN')) {
      GpsFuser.right(line);
    } else {
      console.log('NMEA1: ' + line.toString());
    }
  });

  function setup() {
    setupReceiver(portGpsLeft);
    setupReceiver(portGpsRight);
  }

  function ntripRestart() {
    ntripClient.removeAllListeners();
    ntripClient.close();
    ntripConnect();
  }

  return {
    setup,
    ntripRestart
  }
})();


function setupReceiver(port) {
  port.write('B562068A09000001000005005210000160', 'hex'); //valset disable CFG-UART1  
  port.write('B562068A09000001000005005310000263', 'hex'); //valset disable CFG-UART2  
  port.write('B56206080600C80001000000DD68', 'hex'); //rate 5hz

  port.write('B562068A1D0000010000C700912000C200912000CC00912000BD00912000B300912000E862', 'hex'); // CFG-MSGOUT disable NMEA USB: GSV, GSA, GLL, GGA, VTG  
  port.write('B562068A090000010000AE00912000F98A', 'hex'); //CFG-MSGOUT disable RMC

  //  portGpsLeft.write('B562060108000114000000010000253A', 'hex'); //NAV-HPPOSLLH
  port.write('B562068A09000001000009009120015552', 'hex'); //valset enable CFG-UBX_NAV_PVT_USB
  //port.write('B562068A0900000100000400922001513c', 'hex'); //valset enable CFG-INFMSG-UBX_USB
}

portGpsLeft.open((err) => {
  console.error('portGpsLeft error: ', err);
});
portGpsRight.open((err) => {
  console.error('portGpsRight error: ', err);
});

if (Config.simulator) {
  console.log('simulator on')
  const fork = require('child_process').fork;
  const path = require('path');
  const program = path.resolve('../ubxSimulator/app.js');

  const childLeft = fork(program, ['../ubxSimulator/logsLeft4.ubx', '../ubxSimulator/logsRight4.ubx'], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });
  childLeft.on('message', message => {
    GpsFuser.left(Buffer.from(message.left.raw));
    GpsFuser.right(Buffer.from(message.right.raw));
  });
}


const GpsFuser = (() => {
  const fuse = () => {
    if (!this.receiver1 || !this.receiver2) {
      return;
    }
    if (this.receiver1.iTow === this.receiver2.iTow) {
      State.currentSpeedmms = (this.receiver1.gSpeed + this.receiver2.gSpeed) / 2;
      let r1Location = [this.receiver1.lon, this.receiver1.lat];
      let r2Location = [this.receiver2.lon, this.receiver2.lat];
      let receiverDistance = Calc2.distance(r1Location, r2Location);
      let receiverHeading = Calc2.bearing(r1Location, r2Location);

      let heading = (receiverHeading - 90 + 360) % 360;//kan ook +90 zijn      
      State.driveBearing = heading;
      State.gps.leftLocation = r1Location;
      State.gps.rightLocation = r2Location;
      let heightDifference = this.receiver1.height / 1000 - this.receiver2.height / 1000;
      let realReceiverDistance = Math.sqrt(Math.pow(receiverDistance, 2) + Math.pow(heightDifference, 2));
      let slope = -Calc2.radToDeg(Math.atan(heightDifference / realReceiverDistance));
      State.currentSlope = slope;
      let middleLocation = Calc2.coord(r1Location, receiverHeading, receiverDistance / 2);
      let currentCorrectedLocation = correctForSlopeDual(middleLocation, heading, slope);
      try {
        NewLocation(currentCorrectedLocation);
      } catch (error) {
        console.log('fuse2 catch: ', error);
      }
    }
    function correctForSlopeDual(location, heading, slope) {
      const antennaHeight = DB.getSettings().machine.antennaHeight;
      const y = slope;
      const corrDistance = Math.sin(Calc2.degToRad(y)) * antennaHeight; // overstaande zijde
      // ioRoot.emit('currentSlopeCorrection', corrDistance * 100); // slopeDis
      const correctedLocation = Calc2.coord(location, heading + 90, corrDistance);
      return correctedLocation;
    }
  }

  return {
    left: (ubx) => {
      let responses = ubxParser(ubx)
      responses.forEach(response => {
        this.receiver1 = response;
        if (this.receiver1.fixType === '3D-fix') {
          ntripClient.setXYZ(ecef(this.receiver1.lat, this.receiver1.lon));
        }
        sendInfo.left({
          time: response.iTow,
          satCount: response.numSV,
          quality: response.flags.carrSoln
        });
      });
      fuse();
    },
    right: (ubx) => {
      let responses = ubxParser(ubx)
      responses.forEach(response => {
        this.receiver2 = response;
        sendInfo.right({
          time: response.iTow,
          satCount: response.numSV,
          quality: response.flags.carrSoln
        });
      });
      fuse();
    }
  }

})();

module.exports = GpsReceivers;
