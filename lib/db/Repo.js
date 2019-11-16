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
  static setMachineSettinges(antennaHeight, antennaToFrontAxleDistance, maxSteeringAngle) {
    db.set('settings.machine', { antennaHeight, antennaToFrontAxleDistance, maxSteeringAngle }).write();
  }
  static setTargetPointSettings(timeAheadSeconds, minimumDistance) {
    db.set('settings.targetPoint', { timeAheadSeconds, minimumDistance }).write();
  }
  static setSteeringSettings(method, mode, pid, toleranceDegrees) {
    db.set('settings.steering', { method, mode, pid, toleranceDegrees }).write();
  }
  static setLineOffset(lineOffset){
    db.set('settings.lineOffset', lineOffset).write();
  }
  static getSteeringSettings() {
    return db.get('settings.steering').value();
  }
  
}

module.exports = Repo