
const SerialPort = require('serialport');
const Config = require('./config');
const ubxParser = require('./ubxParser');
const GpsFuser = require('./gpsFuser');
const Readline = require('@serialport/parser-readline');
const spawn = require('child_process').spawn;
var ecef = require('geodetic-to-ecef');
const { NtripClient } = require('ntrip-client');
const portGpsLeft = new SerialPort(Config.gpsLeft.path, { baudRate: 115200, autoOpen: false });
const portGpsRight = new SerialPort(Config.gpsRight.path, { baudRate: 115200, autoOpen: false });
const axios = require('axios');

assistNow();
function assistNow() {
  axios.get('http://online-live1.services.u-blox.com/GetOnlineData.ashx?token=_REPLACE-WITH-UBLOX-ASSISTNOW-TOKEN_;gnss=gps,glo,gal;datatype=eph,alm', { responseType: 'arraybuffer' })
    .then(response => {
      portGpsLeft.write(response.data);
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
    host: 'flepos.vlaanderen.be',
    port: 2101,
    mountpoint: 'FLEPOSVRS32GREC',
    username: '_HIDDEN-NTRIP-CREDENTIALS_',
    password: '_HIDDEN-NTRIP-CREDENTIALS_',
    xyz: ecef(50.9517, 2.6466),
    // the interval of send nmea, unit is millisecond
    interval: 2000,
  };

  const client = new NtripClient(options);
  client.on('data', (data) => {
    portGpsLeft.write(data);
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
        console.log(response)
        GpsFuser.fuseReceiver(0, response);
      });
    } else {
      console.log('NMEA: ' + line.toString());
    }
  });

  function setup() {
    console.log("WRITINGGG");
    portGpsLeft.write('B562068A09000001000005005210000160', 'hex'); //valset disable CFG-UART1
    portGpsLeft.write('B562068A09000001000005005310000263', 'hex'); //valset disable CFG-UART2
    portGpsLeft.write('B56206080600C80001000000DD68', 'hex'); //rate 5hz
    disableNMEA2(portGpsLeft);
    //  portGpsLeft.write('B562060108000114000000010000253A', 'hex'); //NAV-HPPOSLLH
    portGpsLeft.write('B562068A09000001000009009120015552', 'hex'); //valset enable CFG-UBX_NAV_PVT_USB
    portGpsLeft.write('B562068A0900000100000400922001513c', 'hex'); //valset enable CFG-INFMSG-UBX_USB
  }

  return {
    setup
  }
})();


function disableNMEA2(port) {
  port.write('B562068A1D0000010000C700912000C200912000CC00912000BD00912000B300912000E862', 'hex'); // CFG-MSGOUT disable NMEA USB: GSV, GSA, GLL, GGA, VTG
  port.write('B562068A090000010000AE00912000F98A', 'hex'); //CFG-MSGOUT disable RMC
}

portGpsLeft.open();

process.on('SIGINT', function () {
  console.log('stop!!!')
  str2str.kill();
  process.exit();
});

module.exports = GpsReceivers;
