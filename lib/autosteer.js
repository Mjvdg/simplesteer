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
        let steeringMode = DB.getSteeringSettings().mode;
        tolerance = DB.getSteeringSettings().toleranceDegrees;
        degreesToTurn = State.degreesToTurn;
        currentWheelAngle = State.currentWheelAngle;

        if (Math.abs(degreesToTurn - currentWheelAngle) < tolerance) {
            arduinoApi.turnStop();
            return;
        }

        if (steeringMode === 'simple') {
            simpleAutosteer();
        }
        if (steeringMode === 'pid') {
            pidAutosteer();
        }
    }
    return {
        update
    }

    function pidAutosteer() {
        PidController.setTarget(State.degreesToTurn);
        let correction = PidController.update(State.currentWheelAngle);
        let minimumMotorPwm = DB.getSteeringSettings().minimumMotorPwm;
        let isTurnRight = correction > 0;
        correction = Math.abs(correction);
        if (correction < minimumMotorPwm) {
            correction = minimumMotorPwm;
        }
        if (!isTurnRight) {
            arduinoApi.setPwm(correction);
            arduinoApi.turnLeft();
        }
        if (isTurnRight) {
            arduinoApi.setPwm(correction);
            arduinoApi.turnRight();
        }
    }

    function simpleAutosteer() {
        let maxSteeringAngle = DB.getSettings().machine.maxSteeringAngle;
        let steeringMethod = DB.getSteeringSettings().method

        let isMotorOnWheel = steeringMethod === "motorOnWheel";
        let isHydraulic = steeringMethod === "hydraulic";


        if (degreesToTurn - tolerance > currentWheelAngle + tolerance) {
            if (State.currentWheelAngle < maxSteeringAngle) {
                //turn Right
                if (isMotorOnWheel) {

                }
                if (isHydraulic) {

                }
            }
        } else if (degreesToTurn + tolerance < currentWheelAngle - tolerance) {
            if (State.currentWheelAngle > -maxSteeringAngle) {
                //turn Left
                if (isMotorOnWheel) {

                }
                if (isHydraulic) {

                }
            }
        }
    }
})();

module.exports = Autosteer