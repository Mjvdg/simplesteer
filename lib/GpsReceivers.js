
const SerialPort = require('serialport');
const Config = require('./config');
const ubxParser = require('./ubxParser');
const GpsFuser = require('./gpsFuser');
const Readline = require('@serialport/parser-readline');
const spawn = require('child_process').spawn;
var ecef = require('geodetic-to-ecef');
const sendInfo = require('./socketIO-send').sendInfo;
const { NtripClient } = require('ntrip-client');
const portGpsLeft = new SerialPort(Config.gpsLeft.path, { baudRate: 115200, autoOpen: false });
const portGpsRight = new SerialPort(Config.gpsRight.path, { baudRate: 115200, autoOpen: false });
const axios = require('axios');
const DB = require('./db/Repo');

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

function ntrip1() {
  const str2str = spawn('./str2str',
    [
      '-in',
      'ntrip://_HIDDEN-NTRIP-CREDENTIALS_:_HIDDEN-NTRIP-CREDENTIALS_@flepos.vlaanderen.be:2101/FLEPOSVRS32GREC',
      'rtcm3',
      '-p',
      '50.9517',
      '2.6466',
      '50',
      '-n',
      '1'
    ]);

  str2str.stdout.pipe(portGpsLeft);
  str2str.stderr.on('data', (data) => {
    //console.error(`stderr: ${data}`);
  });
  str2str.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function ntrip2() {
  const options = {
    host: DB.getSettings().ntrip.host,
    port: DB.getSettings().ntrip.port,
    mountpoint: DB.getSettings().ntrip.mountpoint,
    username: DB.getSettings().ntrip.username,
    password: DB.getSettings().ntrip.password,
    xyz: ecef(50.9517, 2.6466),
    // the interval of send nmea, unit is millisecond
    interval: 2000,
  };

  const client = new NtripClient(options);
  client.on('data', (data) => {
    portGpsLeft.write(data);
    portGpsRight.write(data);
  });
  client.on('close', () => {
    console.log('client close');
  });
  client.on('error', (err) => {
    console.log(err);
  });
  client.run();
}


//const parserLeft = new Readline()
//portGpsLeft.pipe(parserLeft)

const GpsReceivers = (() => {
  portGpsLeft.on('data', (line) => {
    if (!line.toString().startsWith('$GN')) {
      let responses = ubxParser.parse(line);
      responses.forEach(response => {
        //console.log("LEFT: ", response);
        GpsFuser.fuseReceiver(0, response);
        sendInfo(0, {
          time: response.iTow,
          satCount: response.numSV,
          quality: response.flags.carrSoln
        })
      });
    } else {
      console.log('NMEA0: ' + line.toString());
    }
  });

  portGpsRight.on('data', (line) => {
    if (!line.toString().startsWith('$GN')) {
      let responses = ubxParser.parse(line);
      responses.forEach(response => {
        //console.log("RIGHT: ", response);
        GpsFuser.fuseReceiver(1, response);
        sendInfo(1, {
          time: response.iTow,
          satCount: response.numSV,
          quality: response.flags.carrSoln
        })
      });
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


function setupReceiver(port) {
  portGpsLeft.write('B562068A09000001000005005210000160', 'hex'); //valset disable CFG-UART1
  portGpsLeft.write('B562068A09000001000005005310000263', 'hex'); //valset disable CFG-UART2
  portGpsLeft.write('B56206080600C80001000000DD68', 'hex'); //rate 5hz

  port.write('B562068A1D0000010000C700912000C200912000CC00912000BD00912000B300912000E862', 'hex'); // CFG-MSGOUT disable NMEA USB: GSV, GSA, GLL, GGA, VTG
  port.write('B562068A090000010000AE00912000F98A', 'hex'); //CFG-MSGOUT disable RMC

  //  portGpsLeft.write('B562060108000114000000010000253A', 'hex'); //NAV-HPPOSLLH
  portGpsLeft.write('B562068A09000001000009009120015552', 'hex'); //valset enable CFG-UBX_NAV_PVT_USB
  portGpsLeft.write('B562068A0900000100000400922001513c', 'hex'); //valset enable CFG-INFMSG-UBX_USB
}

portGpsLeft.open();
portGpsRight.open();

process.on('SIGINT', function () {
  console.log('stop!!!')
  str2str.kill();
  process.exit();
});

module.exports = GpsReceivers;
