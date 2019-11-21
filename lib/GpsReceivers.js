var nmea = require("nmea-simple");
const SerialPort = require('serialport');
const Config = require('./config');
const ubxParser = require('./ubxParser');
const Readline = require('@serialport/parser-readline');
const spawn = require('child_process').spawn;
const portGpsLeft = new SerialPort(Config.gpsLeft.path, { baudRate: 115200, autoOpen: false });
const portGpsRight = new SerialPort(Config.gpsRight.path, { baudRate: 115200, autoOpen: false });

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
// str2str.stdout.on('data', (data) => {
//   //console.log(data);
//   portGpsLeft.write(data, 'binary')
// });
str2str.stdout.pipe(portGpsLeft);
str2str.stderr.on('data', (data) => {
  //console.error(`stderr: ${data}`);
});
str2str.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});


//const parserLeft = new Readline()
//portGpsLeft.pipe(parserLeft)

const GpsReceivers = (() => {
  portGpsLeft.on('data', (line) => {
    if (!line.toString().startsWith('$GN')) {
      ubxParser.parse(line);
    } else {
      console.log('NMEA: ' + line.toString());
    }

  });

  function setup() {
    //portGpsRight.write('B5620608C8','hex');

    setTimeout(function () {
      console.log("WRITINGGG");

      portGpsLeft.write('B562068A09000001000005005210000160', 'hex'); //valset disable CFG-UART1
      portGpsLeft.write('B562068A09000001000005005310000263', 'hex'); //valset disable CFG-UART2
      disableNMEA2(portGpsLeft);
      // disableNMEA(portGpsLeft);
      //portGpsLeft.write('B562068A090000010000C7009120001207', 'hex'); //disable CFG-MSGOUT NMEA GSV USB
      portGpsLeft.write('B56206080600C80001000000DD68', 'hex'); //rate 5hz
      //portGpsLeft.write('B562060108000114000000010000253A', 'hex'); //NAV-HPPOSLLH old
      portGpsLeft.write('B562068A09000001000036009120018233', 'hex');       //valset enable CFG-MSGOUT-UBX_NAV_HPPOSLLH_USB
      portGpsLeft.write('B562068A09000001000009009120015552', 'hex'); //valset enable CFG-UBX_NAV_PVT_USB


    }, 1000);


  }

  return {
    setup
  }
})();

function disableNMEA2(port) {
  port.write('B562068A1D0000010000C700912000C200912000CC00912000BD00912000B300912000E862', 'hex'); // disable NMEA USB: GSV, GSA, GLL, GGA, VTG
}

function disableNMEA(port) {
  port.write('B56206010300F00A000423', 'hex');
  port.write('B56206010300F009000321', 'hex');
  port.write('B56206010300F00000FA0F', 'hex');
  port.write('B56206010300F00100FB11', 'hex');
  port.write('B56206010300F00D000729', 'hex');
  port.write('B56206010300F00600001B', 'hex');
  port.write('B56206010300F00200FC13', 'hex');
  port.write('B56206010300F00700011D', 'hex');
  port.write('B56206010300F00300FD15', 'hex');
  port.write('B56206010300F00400FE17', 'hex');
  port.write('B56206010300F00F00092D', 'hex');
  port.write('B56206010300F00500FF19', 'hex');
  port.write('B56206010300F00800021F', 'hex');
  port.write('B56206010300F10000FB12', 'hex');
  port.write('B56206010300F10100FC14', 'hex');

  // port.write('B56206010300F10300FE18', 'hex');
  // port.write('B56206010300F10400FF1A', 'hex');
  // port.write('B56206010300F10500001C', 'hex');
  // port.write('B56206010300F10600011E', 'hex');
}


portGpsLeft.open();

process.on('SIGINT', function () {
  console.log('stop!!!')
  str2str.kill();
  process.exit();
});

module.exports = GpsReceivers;
