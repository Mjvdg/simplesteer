
"use strict";
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const DB = require('./db/Repo');
const adapter = new FileSync('./fields.json');
const State = require('./state');
const db = low(adapter);

db.defaults({ fields: [] }).write();

function saveCurrentField(name) {
  let type = DB.getSettings().mode;

  if (type === 'straightABlines') {
    saveStraightABlines(name);
  }
  if (type === 'curvedABlines') {
    saveCurvedABlines(name);
  }
}
function saveStraightABlines(name) {
  db.get('fields')
    .push({ id: Date.now(), name, type: 'straightABlines', pointA: State.pointA.location, pointB: State.pointB.location})
    .write();
}
function saveCurvedABlines(name) {
  db.get('fields')
    .push({ id: Date.now(), name, type: 'curvedABlines', abLine: State.curvedLines.abLine })
    .write();
}

function getFieldHeaders(){
  let fields = db.get('fields');
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