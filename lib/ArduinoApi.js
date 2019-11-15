const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const config = require('./config');
const AngleSensorTracker = require('./angleSensorTracker');
const ioSend = require('./socketIO-send');

const arduinoApi = (() => {
  const arduinoPort = new SerialPort(config.arduino.path, {
    baudRate: config.arduino.baudRate,
    autoOpen: false
  });

  const parser = arduinoPort.pipe(new Readline({ delimiter: '\r\n' }));

  arduinoPort.on('close', () => {
    console.log('Serial port disconnected.');
  });

  parser.on('data', (jsonLine) => {
    let line
    try {
      line = JSON.parse(jsonLine);
    } catch (error) {
      // console.log(error);
    }
    if (line !== undefined) {
      AngleSensorTracker.addRaw(line.steer);
      ioSend.sendRawAngleSensor(line.steer);
      ioSend.sendCurrentWheelAngle();
    }
  });


  function open() {
    arduinoPort.open((err) => {
      if (err) {
        console.log('Error opening port: ', err.message);
      }
    });
  }
  return {
    open
  }
})();


module.exports = arduinoApi;