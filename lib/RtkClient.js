"use strict";
const net = require('net');
const config = require('./config');
const GpsFuser = require('./gpsFuser');
const sendInfo = require('./socketIO-send').sendInfo;
class RtkClient{
  constructor(nr){ // 0 of 1
    this.netClient = new net.Socket();
    this.nr = nr;
    this.connectOptions = {
      host: config.rtkClient[nr].host,
      port: config.rtkClient[nr].port,
    }
    this.netClient.on('error', (err) => {
      console.log(`rtkclient ${this.nr} connection error: ${err}`)
      console.log(err);
    });
    this.netClient.on('data', (data) => {
      this._processData(data);
    });
    this.netClient.on('close', () => {
      console.log(`rtkclient ${this.nr} connection closed`)
      this.netClient.setTimeout(1000, () => {
        this.netClient.connect(this.connectOptions);
      });
    });
    this.netClient.connect(this.connectOptions);
  }

  _processData(input){
    let row = input.toString().trim().split(/ +/g);
    let date = row[0];
    let time = row[1];
    let dateTime = new Date(`${date} ${time}`);

    let receiver = {
      location: {},
      dateTime: dateTime,
      location:{
        latitude:  Number(row[2]),
        longitude: Number(row[3]),
      },
      height: Number(row[4]),
      quality: this._getQualityFromNumber(row[5]),
      satCount: row[6],
    };
    GpsFuser.fuseReceiver(this.nr, receiver)
    sendInfo(this.nr, receiver);
  }

  _getQualityFromNumber(number) {
    switch (number) {
    case '1':
        return 'Fix';
    case '2':
        return 'Float';
    case '4':
        return 'DGPS';
    case '5':
        return 'Single';
    default:
        return 'Error';
    }
  }
}

module.exports = RtkClient;