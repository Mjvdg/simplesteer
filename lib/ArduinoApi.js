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
    open,
    setPwm: (pwm) => {
      if (pwm > 255) {
        pwm = 255;
      }
      send(JSON.stringify({ p: pwm }));
    },
    turnRight: () => {
      send(JSON.stringify({ c: 'r' }));
    },
    turnLeft: () => {
      send(JSON.stringify({ c: 'l' }));
    },
    turnStop: () => {
      send(JSON.stringify({ c: 's' }));
    }
  }
  function send(data) {
    arduinoPort.write(data + '\n');
  }
})();


module.exports = arduinoApi;