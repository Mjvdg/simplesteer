const ioSend = require('./socketIO-send');

const AngleSensorTracker = (() => {
    function addRaw(data){
        ioSend.sendRawAngleSensor(data);
    }
    return {
        addRaw
    }
})();

module.exports = AngleSensorTracker;