"use strict";
const FileSync = require('lowdb/adapters/FileSync');
const db = require('lowdb')(new FileSync('./database.json'));
require('./setDefaults')(db);

class Repo{
  static getSettings(){
    return db.get('settings').value();
  }

  static setMachineWidth(width){
    db.set('settings.machineWidth', width).write();
  }
}

module.exports = Repo