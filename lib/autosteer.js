"use strict";
const DB = require('./db/Repo');
const State = require('./state');
const arduinoApi = require('./ArduinoApi');
const PidController = require('./pidController');

const Autosteer = (() => {
    const update = () => {
        let steeringMode = DB.getSteeringSettings().mode
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
        console.log(correction);
    }

    function simpleAutosteer() {
        let tolerance = DB.getSteeringSettings().toleranceDegrees;
        let maxSteeringAngle = DB.getSettings().machine.maxSteeringAngle;
        let steeringMethod = DB.getSteeringSettings().method

        let isMotorOnWheel = steeringMethod === "motorOnWheel";
        let isHydraulic = steeringMethod === "hydraulic";
        let degreesToTurn = State.degreesToTurn;
        let currentWheelAngle = State.currentWheelAngle;
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