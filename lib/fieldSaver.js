
"use strict";
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const DB = require('./db/Repo');
const adapter = new FileSync('./fields.json');
const State = require('./state');
const db = low(adapter);
const Enum = require('./enums');

db.defaults({ fields: [] }).write();

function saveCurrentField(name) {
  let type = DB.getSettings().mode;
  
  if (type === Enum.SteeringMode.straightABlines) {
    saveStraightABlines(name);
  }
  
  if (type === Enum.SteeringMode.curvedLines) {
    saveCurvedABlines(name);
  }
  if (type === Enum.SteeringMode.path) {
    savePath(name);
  }
}
function saveStraightABlines(name) {
  db.get('fields')
    .push({ id: Date.now(), name, type: Enum.SteeringMode.straightABlines, recordedWork: State.bigWorkPolygons, pointA: State.pointA.location, pointB: State.pointB.location})
    .write();
}
function saveCurvedABlines(name) {
  db.get('fields')
    .push({ id: Date.now(), name, type: Enum.SteeringMode.curvedLines, recordedWork: State.bigWorkPolygons, abLine: State.curvedLines.abLine })
    .write();
}
function savePath(name){
  db.get('fields')
  .push({ id: Date.now(), name, type: Enum.SteeringMode.path, recordedWork: State.bigWorkPolygons, abLine: State.curvedLines.abLine })
  .write();
}
function getFieldHeaders(){
  let fields = db.get('fields').sortBy('id').reverse();
  let headers = fields.map((field) => {
    return {id: field.id, name: field.name, type: field.type};
  });
  return headers;
}

function getField(id){
  let field = db.get('fields').find({id}).value();
  return field;
}

function deleteField(id){
  db.get('fields').remove({id}).write();
}
module.exports = {
  saveCurrentField,
  getFieldHeaders,
  getField,
  deleteField,
}