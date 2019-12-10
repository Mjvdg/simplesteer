//@ts-check
const SerialPort = require('serialport');
const Config = require('../config');
const ubxParser = require('./ubxParser');
const GpsFuser = require('./gpsFuser');
var ecef = require('geodetic-to-ecef');
const fs = require('fs');
const sendInfo = require('./socketIO-send').sendInfo;
const { NtripClient } = require('ntrip-client');
const portGpsLeft = new SerialPort(Config.gpsLeft.path, { baudRate: 115200, autoOpen: false });
const portGpsRight = new SerialPort(Config.gpsRight.path, { baudRate: 115200, autoOpen: false });

const axios = require('axios').default;
const DB = require('./db/Repo');

const ntripClient = new NtripClient({
  host: DB.getSettings().ntrip.host,
  port: DB.getSettings().ntrip.port,
  mountpoint: DB.getSettings().ntrip.mountpoint,
  username: DB.getSettings().ntrip.username,
  password: DB.getSettings().ntrip.password,
  interval: 2000 // the interval of send nmea, unit is millisecond
});

assistNow();
function assistNow() {
  axios.get('http://online-live1.services.u-blox.com/GetOnlineData.ashx?token=_REPLACE-WITH-UBLOX-ASSISTNOW-TOKEN_;gnss=gps,glo,gal;datatype=eph,alm', { responseType: 'arraybuffer' })
    .then(response => {
      portGpsLeft.write(response.data);
      portGpsRight.write(response.data);
    }).catch(error => {
      console.error(error);
    });
}

ntrip2();

function ntrip2() {
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
    fs.appendFileSync('logsLeft.ubx', line, { encoding: 'binary' });
    if (!line.toString().startsWith('$GN')) {
      processUbxLeft(line);
    } else {
      console.log('NMEA0: ' + line.toString());
    }
  });
  portGpsRight.on('data', (line) => {
    fs.appendFileSync('logsRight.ubx', line, { encoding: 'binary' });
    if (!line.toString().startsWith('$GN')) {
      processUbxRight(line);
    } else {
      console.log('NMEA1: ' + line.toString());
    }
  });

  function setup() {
    console.log("WRITINGGG");
    setupReceiver(portGpsLeft);
    setupReceiver(portGpsRight);
  }

  return {
    setup
  }
})();

function processUbxLeft(ubx) {
  let responses = ubxParser.parse(ubx);
  responses.forEach(response => {
    if (response.fixType === '3D-fix') {
      ntripClient.setXYZ(ecef(response.lat, response.lon));
    }
    GpsFuser.fuseReceiver(0, response);
    sendInfo(0, {
      time: response.iTow,
      satCount: response.numSV,
      quality: response.flags.carrSoln
    });
  });
}

function processUbxRight(ubx) {
  let responses = ubxParser.parse(ubx);
  responses.forEach(response => {
    GpsFuser.fuseReceiver(1, response);
    sendInfo(1, {
      time: response.iTow,
      satCount: response.numSV,
      quality: response.flags.carrSoln
    });
  });
}

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

portGpsLeft.open((err)=>{
  console.error(err);
});
portGpsRight.open((err)=>{
  console.error(err);
});

if (Config.simulator) {
  console.log('hewego')
  const fork = require('child_process').fork;
  const path = require('path');
  const program = path.resolve('../ubxSimulator/app.js');
  
  const childLeft = fork(program, ['../ubxSimulator/logsLeft4.ubx', '../ubxSimulator/logsRight4.ubx'], {stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]});
  childLeft.on('message', message => {
    processUbxLeft(Buffer.from(message.left.raw));
    processUbxRight(Buffer.from(message.right.raw));
  });  
}

module.exports = GpsReceivers;
