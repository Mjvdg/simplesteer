"use strict";
const DB = require('./db/Repo');
const State = require('./state');
const arduinoApi = require('./ArduinoApi');
const PidController = require('./pidController');

const Autosteer = (() => {
    let tolerance;
    let degreesToTurn;
    let currentWheelAngle;
    const update = () => {
        tolerance = DB.getSteeringSettings().toleranceDegrees;
        degreesToTurn = State.degreesToTurn;
        currentWheelAngle = State.currentWheelAngle;

        if (Math.abs(degreesToTurn - currentWheelAngle) < tolerance) {
            arduinoApi.turnStop();
            return;
        }
        pidAutosteer();        
    }
    return {
        update
    }

    function pidAutosteer() {
        let degreesToTurn = State.degreesToTurn;
        let currentWheelAngle = State.currentWheelAngle;
        let maxSteeringAngle = DB.getSettings().machine.maxSteeringAngle;
        if(degreesToTurn < -maxSteeringAngle){
            degreesToTurn = -maxSteeringAngle;
        }
        if(degreesToTurn > maxSteeringAngle){
            degreesToTurn = maxSteeringAngle;
        }
        PidController.setTarget(degreesToTurn);
        let steeringMethod = DB.getSteeringSettings().method
        let correction = PidController.update(currentWheelAngle);
        let minimumMotorPwm = DB.getSteeringSettings().minimumMotorPwm;
        let minimumPulseDuration = DB.getSteeringSettings().minimumPulseDuration;
        let isTurnRight = correction > 0;
        correction = Math.abs(correction);

        if (steeringMethod === 'hydraulic') {
            if (correction < minimumPulseDuration) {
                correction = minimumPulseDuration;
            }
            arduinoApi.setPulseDuration(correction);
            if (!isTurnRight) {
                arduinoApi.pulseLeft();
            }
            if (isTurnRight) {
                arduinoApi.pulseRight();
            }
            arduinoApi.setPwm(255);
        }
        if (steeringMethod === 'motorOnWheel') {
            if (correction < minimumMotorPwm) {
                correction = minimumMotorPwm;
            }
            arduinoApi.setPwm(correction);
            if (!isTurnRight) {
                arduinoApi.turnLeft();
            }
            if (isTurnRight) {
                arduinoApi.turnRight();
            }
        }
    }
})();

module.exports = Autosteer