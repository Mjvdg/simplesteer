const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const config = require('./config');
const AngleSensorTracker = require('./angleSensorTracker');

const arduinoApi = function(){
  const arduinoPort = new SerialPort(config.arduino.path, {
    baudRate: config.arduino.baudRate,
    autoOpen: false
  });

  const parser = arduinoPort.pipe(new Readline({ delimiter: '\r\n' }));

  arduinoPort.open((err) => {
    if (err) {
      console.log('Error opening port: ', err.message);
    }
  });

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
    if(line !== undefined){
        AngleSensorTracker.addRaw(line.steer);
    }
  });
}
 

module.exports = arduinoApi;