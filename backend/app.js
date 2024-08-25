"use strict";
const fs = require('fs');
require('./lib/GpsReceivers').setup();
require('./lib/ArduinoApi').open();
require('./lib/socketIO');