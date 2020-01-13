"use strict";
const FileSync = require('lowdb/adapters/FileSync');
const db = require('lowdb')(new FileSync('./database.json'));
require('./setDefaults')(db);

class Repo {
  static getSettings() {
    return db.get('settings').value();
  }

  static setMachineWidth(width) {
    db.set('settings.machineWidth', width).write();
  }
  static setSteeringAngleSensor(maxLeft, straight, maxRight) {
    db.set('settings.steeringAngleSensor', { maxLeft, straight, maxRight }).write();
  }
  static setMachineSettinges(antennaHeight, antennaToFrontAxleDistance, antennaToRearAxleDistance, maxSteeringAngle, isReverseSteeringEnabled) {
    db.set('settings.machine', { antennaHeight, antennaToFrontAxleDistance, antennaToRearAxleDistance, maxSteeringAngle, isReverseSteeringEnabled }).write();
  }
  static setTargetPointSettings(timeAheadSeconds, minimumDistance) {
    db.set('settings.targetPoint', { timeAheadSeconds, minimumDistance }).write();
  }
  static setSteeringSettings(method, pid, toleranceDegrees, minimumMotorPwm, minimumPulseDuration) {
    db.set('settings.steering', { method, pid, toleranceDegrees, minimumMotorPwm, minimumPulseDuration }).write();
  }
  static setLineOffset(lineOffset){
    db.set('settings.lineOffset', lineOffset).write();
  }
  static setNtripSettings(host, username, password, mountpoint, port){
    db.set('settings.ntrip', {host, username, password, mountpoint, port}).write();
  }
  static getSteeringSettings() {
    return db.get('settings.steering').value();
  }
  static setMode(mode){
    db.set('settings.mode', mode).write();
  }
}

module.exports = Repo